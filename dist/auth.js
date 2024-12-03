"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const googleapis_1 = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";
const authenticate = async () => {
    const credentials = JSON.parse(fs_1.default.readFileSync("credentials.json", "utf8"));
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    if (fs_1.default.existsSync(TOKEN_PATH)) {
        const token = fs_1.default.readFileSync(TOKEN_PATH, "utf8");
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    }
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);
    // Replace this with the actual code you retrieve from the URL
    const authCode = "<PASTE_AUTH_CODE>"; // Temporary: replace dynamically
    const { tokens } = await oAuth2Client.getToken(authCode);
    fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
};
exports.default = authenticate;
