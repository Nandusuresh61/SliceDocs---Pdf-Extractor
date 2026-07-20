import jwt from "jsonwebtoken";
import { ITokenService } from "../../application/interface/ITokenService";
import { env } from "../../config/env";

export class JwtService implements ITokenService {
  generateAccessToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): Record<string, unknown> {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as Record<string, unknown>;
  }

  verifyRefreshToken(token: string): Record<string, unknown> {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as Record<string, unknown>;
  }
}
