import { Request, Response } from "express";
import { IGoogleAuthUseCase } from "../../application/interface/usecase/IGoogleAuthUseCase";
import { IRefreshTokenUseCase } from "../../application/interface/usecase/IRefreshTokenUseCase";
import { UserMapper } from "../../application/mappers/UserMapper";
import { AppError } from "../../shared/errors/AppError";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { ApiResponse } from "../../shared/response/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
  constructor(
    private readonly googleAuthUseCase: IGoogleAuthUseCase,
    private readonly refreshTokenUseCase: IRefreshTokenUseCase
  ) {}

  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      throw new AppError(
        APP_MESSAGE.GOOGLE_ID_TOKEN_REQUIRED,
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
      APP_MESSAGE.AUTH_SUCCESS,
      HTTP_STATUS.OK
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return ApiResponse.success(res, null, APP_MESSAGE.LOGOUT_SUCCESS, HTTP_STATUS.OK);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        APP_MESSAGE.REFRESH_TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      );
    }

    const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute(refreshToken);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = UserMapper.toResponse(user);

    return ApiResponse.success(
      res,
      userResponse,
      APP_MESSAGE.TOKEN_REFRESHED,
      HTTP_STATUS.OK
    );
  });
}
