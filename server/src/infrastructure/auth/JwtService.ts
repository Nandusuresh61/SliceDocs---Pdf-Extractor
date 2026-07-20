import jwt from "jsonwebtoken";
import { ITokenService } from "../../application/interface/ITokenService";
import { env } from "../../config/env";

export class JwtService implements ITokenService {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }
}
