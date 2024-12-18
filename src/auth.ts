import fs from "fs";
import { google, Auth } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
const TOKEN_PATH = "token.json";

const authenticate = async (): Promise<Auth.OAuth2Client> => {
  const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH, "utf8");
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this URL:", authUrl);
  console.log("Enter the code from that page here:");

  // Replace `<PASTE_AUTH_CODE>` with a real code from the authorization URL
  const authCode =
    "4/0AeanS0b_kaD46GgB9trnLcNA0b4Ml3LvpE_DkUnqlcPX1Fgg2-AXEgVC249SUxzHnMqhtg";
  const { tokens } = await oAuth2Client.getToken(authCode);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
};

export default authenticate;
