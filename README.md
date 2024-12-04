
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
5. Set up a scope gmail.modify to read and write emails.
   - Go to **APIs & Services > OAuth consent screen**.
   - Add the scope `https://www.googleapis.com/auth/gmail.modify` to the scopes.


### 4. Authenticate with Gmail
Run the authentication script to generate `token.json`:
```bash
npx ts-node src/auth.ts
```
Follow the printed instructions to authenticate the app. You visit the auth url and copy and paste the auth code in the redirect URl into auth.ts and then your your script again. After successful authentication, a `token.json` file will be created.

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
- Add `credentials.json`, and `token.json` to `.gitignore` to prevent accidental commits.
- Use **App Passwords** instead of your primary Gmail password for added security.

---

## Troubleshooting

1. **Authentication Errors**:
   - Ensure the Gmail API is enabled in the Google Cloud Console.
   - Verify the redirect URI in `credentials.json` matches `http://localhost`.

2. **Quota Limits**:
   - The Gmail API has limits on the number of requests. Monitor your usage in the Google Cloud Console.

---

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.
