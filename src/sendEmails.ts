import fs from "fs";
import { google } from "googleapis";
import authenticate from "./auth";

const CV = "nathanvale-FE-2024v6.docx";

const sendEmails = async (): Promise<void> => {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  const emailData: Array<string> = JSON.parse(
    fs.readFileSync("emails.json", "utf8")
  );
  console.log(`Loaded ${emailData.length} email addresses`);

  const emailBodyTemplate = (to: string): string => {
    return [
      `From: "Nathan Vale" <hi@nathanvale.com>`,
      `To: ${to}`,
      `Subject: My Updated CV`,
      `Content-Type: multipart/mixed; boundary="Boundary"`,
      ``,
      `--Boundary`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      `Hello, please find my updated CV attached.`,
      ``,
      `--Boundary`,
      `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document; name="${CV}"`,
      `Content-Disposition: attachment; filename="${CV}"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      fs.readFileSync(`./${CV}`, "base64"),
      ``,
      `--Boundary--`,
    ].join("\r\n");
  };

  for (const email of emailData) {
    console.log(`Sending email to ${email}`);
    try {
      const emailBody = emailBodyTemplate(email);

      // Encode the email in base64url format
      const encodedMessage = Buffer.from(emailBody)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Send the email
      const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log(`Email sent to ${email}: ${res.data.id}`);
    } catch (err) {
      console.error(
        `Failed to send email to ${email}: ${(err as Error).message}`
      );
    }
  }
};

sendEmails().catch(console.error);
