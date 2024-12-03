import fs from "fs";
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  throw new Error(
    "Missing required environment variables: GMAIL_USER or GMAIL_PASS"
  );
}

// Define the email interface

// Define the function to send emails
const sendEmails = async (): Promise<void> => {
  // Load email addresses from emails.json
  const emailData: Array<string> = JSON.parse(
    fs.readFileSync("emails.json", "utf8")
  );

  console.log(`Loaded ${emailData.length} email addresses`);

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  for (const email of emailData) {
    console.log(`Sending email to ${email}`);
    try {
      const info = await transporter.sendMail({
        from: '"Nathan Vale" <hireme@nathanvale.com>', // Replace with your name and email
        to: email,
        subject: "My Updated CV",
        text: "Hello, please find my updated CV attached.",
        attachments: [
          {
            filename: "nathanvale-FE-2024v6.docx",
            path: "./nathanvale-FE-2024v6.docx",
          },
        ],
      });

      console.log(`Email sent to ${email}: ${info.messageId}`);
    } catch (err) {
      console.error(
        `Failed to send email to ${email}: ${(err as Error).message}`
      );
    }
  }
};

// Call the function and handle errors
sendEmails().catch((err) => {
  console.error("Error sending emails:", (err as Error).message);
});
