import { Request, Response } from "express";
import { GoogleAuthUseCase } from "../../application/usecase/auth/GoogleAuthUseCase";
import { UserMapper } from "../../application/mappers/UserMapper";
import { AppError } from "../../shared/errors/AppError";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { ApiResponse } from "../../shared/response/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
  constructor(private readonly googleAuthUseCase: GoogleAuthUseCase) {}

  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      throw new AppError(
        "Google ID Token is required",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODE.VALIDATION_ERROR
      );
    }

    const { user, accessToken, refreshToken } = await this.googleAuthUseCase.execute(idToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = UserMapper.toResponse(user);

    return ApiResponse.success(
      res,
      userResponse,
      "Authentication successful",
      HTTP_STATUS.OK
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return ApiResponse.success(res, null, "Logout successful", HTTP_STATUS.OK);
  });
}
