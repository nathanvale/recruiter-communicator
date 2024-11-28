import fs from "fs";
import { google } from "googleapis";
import authenticate from "./auth";

const extractEmails = async (): Promise<void> => {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "label:Recruiters",
  });

  const messages = res.data.messages || [];
  const emailAddresses = new Set<string>();

  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id || "",
    });
    const headers = msg.data.payload?.headers;

    headers?.forEach((header) => {
      if (header.name === "From") {
        const match = header.value?.match(/<(.+?)>/);
        if (match) emailAddresses.add(match[1]);
      }
    });
  }

  fs.writeFileSync("emails.json", JSON.stringify([...emailAddresses], null, 2));
  console.log("Extracted emails saved to emails.json");
};

extractEmails().catch(console.error);
