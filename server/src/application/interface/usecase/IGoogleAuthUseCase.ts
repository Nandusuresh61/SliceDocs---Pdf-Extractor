import { User } from "../../../domain/entities/User";

export interface IGoogleAuthUseCase {
  execute(idToken: string): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}
