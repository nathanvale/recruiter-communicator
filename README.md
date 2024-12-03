
# Gmail Automation for Job Applications

This project automates Gmail tasks such as extracting emails from a specific label and sending follow-up emails with attachments (e.g., CVs). It is built using **Node.js**, **TypeScript**, and the **Gmail API**.

---

## Features
- Extract email addresses from Gmail messages in a specific label (e.g., `Job Seeking`).
- Send follow-up emails with attachments (e.g., a CV) to the extracted email addresses.
- Securely manage credentials using `.env` files.
- Pagination support for handling large numbers of emails.

---

## Requirements
- **Node.js** (v14 or later)
- **Google Workspace or Gmail Account** with Gmail API enabled
- **Google Cloud Project** for OAuth2 credentials

---

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Gmail API**:
   - Navigate to **APIs & Services > Library**.
   - Search for **Gmail API** and enable it.
4. Create OAuth 2.0 Credentials:
   - Go to **APIs & Services > Credentials**.
   - Create a new **OAuth 2.0 Client ID** for a desktop app.
   - Download the `credentials.json` file and save it in the project root.

### 4. Create a `.env` File
Create a `.env` file in the root of the project to store sensitive credentials:
```env
GMAIL_USER=your-email@your-domain.com
GMAIL_PASS=your-app-password
```

### 5. Authenticate with Gmail
Run the authentication script to generate `token.json`:
```bash
npx ts-node src/auth.ts
```
Follow the printed instructions to authenticate the app. After successful authentication, a `token.json` file will be created.

---

## Usage

### Extract Email Addresses
Run the `extractEmails` script to fetch email addresses from a specific Gmail label:
```bash
npx ts-node src/extractEmails.ts
```
This script will:
1. Query Gmail for messages under a label (e.g., `Job Seeking`).
2. Extract the `From` email addresses.
3. Save the results to `emails.json`.

### Send Emails
Run the `sendEmails` script to send follow-up emails to the addresses in `emails.json`:
```bash
npx ts-node src/sendEmails.ts
```
This script will:
1. Read email addresses from `emails.json`.
2. Send emails with a predefined subject, body, and attachment (e.g., `CV.pdf`).

---

## Sending Emails with Google Workspace

To send emails using a Google Workspace account with **Nodemailer**, follow these steps:

### **1. Enable SMTP for Google Workspace**
1. Log in to the [Google Admin Console](https://admin.google.com/) as an admin.
2. Go to **Apps > Google Workspace > Gmail > User Settings**.
3. Enable the **SMTP relay service** if it’s disabled.

### **2. Create an App Password**
If your account uses 2-Step Verification (recommended for Google Workspace accounts):
1. Log in to your [Google Account](https://myaccount.google.com/) associated with the Google Workspace email.
2. Go to **Security > Signing in to Google > App Passwords**.
3. Create an App Password:
   - Choose **Mail** as the app.
   - Select your device or "Other (Custom)" (e.g., `Nodemailer`).
   - Copy the generated password.

### **3. Update the `.env` File**
Update your `.env` file with your Google Workspace email and the generated App Password:
```env
GMAIL_USER=your-email@your-domain.com
GMAIL_PASS=your-app-password
```

---

## Example: Sending Emails with Nodemailer and Google Workspace

The `sendEmails.ts` script is configured to work with Google Workspace. It uses Gmail's SMTP service to send emails.

```typescript
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Google Workspace email address
    pass: process.env.GMAIL_PASS, // Your App Password
  },
});

const sendEmails = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: "recipient@example.com", // Replace with recipient email
      subject: "Test Email from Google Workspace",
      text: "This is a test email sent from a Google Workspace account using Nodemailer.",
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

sendEmails();
```

---

## File Structure
```
.
├── src/
│   ├── auth.ts             # Handles Gmail API authentication
│   ├── extractEmails.ts    # Extracts email addresses from Gmail
│   ├── sendEmails.ts       # Sends follow-up emails
├── .env                    # Environment variables (ignored by git)
├── emails.json             # Extracted email addresses (generated dynamically)
├── credentials.json        # OAuth 2.0 credentials from Google Cloud Console
├── token.json              # Authentication tokens (generated dynamically)
├── CV.pdf                  # CV or attachment to send via email
└── README.md               # Project documentation
```

---

## Security Notes
- **Do not share** `credentials.json` or `token.json`.
- Add `.env`, `credentials.json`, and `token.json` to `.gitignore` to prevent accidental commits.
- Use **App Passwords** instead of your primary Gmail password for added security.

---

## Troubleshooting

1. **Authentication Errors**:
   - Ensure the Gmail API is enabled in the Google Cloud Console.
   - Verify the redirect URI in `credentials.json` matches `http://localhost`.

2. **SMTP Errors**:
   - Ensure the `.env` file is correctly configured with your Gmail credentials.
   - Use an **App Password** if 2-Step Verification is enabled.

3. **Quota Limits**:
   - The Gmail API has limits on the number of requests. Monitor your usage in the Google Cloud Console.

---

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.
