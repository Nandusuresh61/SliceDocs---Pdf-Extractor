import { AuthController } from "../controllers/AuthController";
import { GoogleAuthUseCase } from "../../application/usecase/auth/GoogleAuthUseCase";
import { RefreshTokenUseCase } from "../../application/usecase/auth/RefreshTokenUseCase";
import { MongoUserRepository } from "../../infrastructure/repositories/UserRepository";
import { JwtService } from "../../infrastructure/auth/JwtService";
import { GoogleOAuthService } from "../../infrastructure/auth/GoogleOAuthService";

const userRepository = new MongoUserRepository();
const tokenService = new JwtService();
const oauthService = new GoogleOAuthService();

const googleAuthUseCase = new GoogleAuthUseCase(
  oauthService,
  userRepository,
  tokenService
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  userRepository,
  tokenService
);

export const authController = new AuthController(googleAuthUseCase, refreshTokenUseCase);
