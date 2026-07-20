export interface ITokenService {
  generateAccessToken(payload: Record<string, unknown>): string;
  generateRefreshToken(payload: Record<string, unknown>): string;
  verifyAccessToken(token: string): Record<string, unknown>;
  verifyRefreshToken(token: string): Record<string, unknown>;
}
