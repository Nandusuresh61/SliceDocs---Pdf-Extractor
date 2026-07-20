export interface IOAuthService {
  verifyGoogleToken(idToken: string): Promise<{ email: string; name: string; avatar?: string; googleId: string }>;
}
