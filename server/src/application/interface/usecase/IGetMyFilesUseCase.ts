import { Document } from "../../../domain/entities/Document";

export interface IGetMyFilesUseCase {
  execute(ownerId: string): Promise<Document[]>;
}
