import { User } from "../../../domain/entities/User";

export interface IRefreshTokenUseCase {
  execute(token: string): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}
