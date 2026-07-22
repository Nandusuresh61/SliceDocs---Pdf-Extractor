import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { Document } from "../../../domain/entities/Document";

import { IGetMyFilesUseCase } from "../../interface/usecase/IGetMyFilesUseCase";

export class GetMyFilesUseCase implements IGetMyFilesUseCase {
  constructor(private readonly _documentRepository: IDocumentRepository) {}

  async execute(ownerId: string): Promise<Document[]> {
    if (!ownerId) {
      throw new Error("Owner ID is required");
    }
    return await this._documentRepository.findAllByOwner(ownerId);
  }
}
