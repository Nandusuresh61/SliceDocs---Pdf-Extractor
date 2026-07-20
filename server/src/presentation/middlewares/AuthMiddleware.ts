import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { JwtService } from "../../infrastructure/auth/JwtService";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";

export interface AuthRequest extends Request {
  user?: any;
}

const jwtService = new JwtService();

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new AppError(
        APP_MESSAGE.AUTH_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      )
    );
  }

  try {
    const decoded = jwtService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new AppError(
        APP_MESSAGE.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      )
    );
  }
};
