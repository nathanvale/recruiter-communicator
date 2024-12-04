import fs from "fs";
import { google } from "googleapis";
import authenticate from "./auth";

const extractEmails = async (): Promise<void> => {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  const query = "label:(job-seeking OR Recruiter)";
  let allMessages: Array<{ id?: string }> = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const res: any = await gmail.users.messages.list({
      userId: "me",
      q: query,
      pageToken: nextPageToken,
    });

    const messages = res.data.messages || [];
    allMessages = allMessages.concat(messages);
    nextPageToken = res.data.nextPageToken; // Get the token for the next page
  } while (nextPageToken);

  console.log(allMessages.length, "messages found");

  const emailAddresses = new Set<string>();

  for (const message of allMessages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id || "",
    });
    const headers = msg.data.payload?.headers;

    headers?.forEach((header) => {
      if (header.name === "From") {
        const match = header.value?.match(/<(.+?)>/);
        if (match) {
          emailAddresses.add(match[1]);
          console.log("Found email:", match[1]);
        }
      }
    });
  }

  // Save extracted email addresses to a JSON file
  fs.writeFileSync("emails.json", JSON.stringify([...emailAddresses], null, 2));
  console.log("Extracted emails saved to emails.json");
};

extractEmails().catch(console.error);
