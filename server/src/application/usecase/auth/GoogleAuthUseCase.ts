import { IOAuthService } from "../../interface/IOAuthService";
import { IUserRepository } from "../../interface/IUserRepository";
import { ITokenService } from "../../interface/ITokenService";
import { User } from "../../../domain/entities/User";

import { IGoogleAuthUseCase } from "../../interface/usecase/IGoogleAuthUseCase";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly _oauthService: IOAuthService,
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {}

  async execute(idToken: string) {
    const googleUser = await this._oauthService.verifyGoogleToken(idToken);

    let user = await this._userRepository.findByEmail(googleUser.email);
    if (!user) {
      user = new User({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
      });
      user = await this._userRepository.save(user);
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = this._tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this._tokenService.generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }
}
