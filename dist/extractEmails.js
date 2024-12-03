"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const auth_1 = __importDefault(require("./auth")); // Assuming auth.ts is also in src/
// Define a utility function to extract email addresses
const extractEmails = async () => {
    const auth = await (0, auth_1.default)();
    const gmail = googleapis_1.google.gmail({ version: "v1", auth });
    // Query emails from a label (modify the label name as needed)
    const queryLabel = "label:Recruiters"; // Adjust query as needed
    const res = await gmail.users.messages.list({
        userId: "me",
        q: queryLabel,
    });
    const messages = res.data.messages || [];
    const emailAddresses = new Set();
    for (const message of messages) {
        const msg = await gmail.users.messages.get({
            userId: "me",
            id: message.id || "",
        });
        const headers = msg.data.payload?.headers;
        headers?.forEach((header) => {
            if (header.name === "From") {
                const match = header.value?.match(/<(.+?)>/);
                if (match)
                    emailAddresses.add(match[1]);
            }
        });
    }
    // Write extracted email addresses to a JSON file
    fs_1.default.writeFileSync("emails.json", JSON.stringify([...emailAddresses], null, 2));
    console.log("Extracted emails saved to emails.json");
};
// Call the function
extractEmails().catch((err) => console.error("Error extracting emails:", err));
