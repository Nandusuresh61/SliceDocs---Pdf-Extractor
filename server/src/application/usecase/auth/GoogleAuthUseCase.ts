import { IOAuthService } from "../../interface/IOAuthService";
import { IUserRepository } from "../../interface/IUserRepository";
import { ITokenService } from "../../interface/ITokenService";
import { User } from "../../../domain/entities/User";

export class GoogleAuthUseCase {
  constructor(
    private readonly oauthService: IOAuthService,
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(idToken: string) {
    const googleUser = await this.oauthService.verifyGoogleToken(idToken);

    let user = await this.userRepository.findByEmail(googleUser.email);
    if (!user) {
      user = new User({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        googleId: googleUser.googleId,
      });
      user = await this.userRepository.save(user);
    }

    const tokenPayload = { id: user.id, email: user.email };
    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }
}
