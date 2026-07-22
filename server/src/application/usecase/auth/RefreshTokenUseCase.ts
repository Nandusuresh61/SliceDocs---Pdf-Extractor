import { IUserRepository } from "../../interface/IUserRepository";
import { ITokenService } from "../../interface/ITokenService";
import { AppError } from "../../../shared/errors/AppError";
import { HTTP_STATUS } from "../../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../../shared/constants/ErrorCode";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";

import { IRefreshTokenUseCase } from "../../interface/usecase/IRefreshTokenUseCase";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(token: string) {
    if (!token) {
      throw new AppError(APP_MESSAGE.REFRESH_TOKEN_REQUIRED, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.UNAUTHORIZED);
    }

    let decoded: { id: string; [key: string]: unknown };
    try {
      decoded = this._tokenService.verifyRefreshToken(token) as { id: string; [key: string]: unknown };
    } catch (_error) {
      throw new AppError(APP_MESSAGE.INVALID_REFRESH_TOKEN, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.UNAUTHORIZED);
    }

    const user = await this._userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError(APP_MESSAGE.USER_NOT_FOUND, HTTP_STATUS.UNAUTHORIZED, ERROR_CODE.UNAUTHORIZED);
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = this._tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }
}
