import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { Document } from "../../../domain/entities/Document";

export class GetMyFilesUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(ownerId: string): Promise<Document[]> {
    if (!ownerId) {
      throw new Error("Owner ID is required");
    }
    return await this.documentRepository.findAllByOwner(ownerId);
  }
}
