import { OAuth2Client } from "google-auth-library";
import { IOAuthService } from "../../application/interface/IOAuthService";
import { env } from "../../config/env";

export class GoogleOAuthService implements IOAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(idToken: string): Promise<{ email: string; name: string; avatar?: string; googleId: string }> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error("Invalid Google token payload");
    }

    return {
      email: payload.email,
      name: payload.name || "User",
      avatar: payload.picture,
      googleId: payload.sub,
    };
  }
}
