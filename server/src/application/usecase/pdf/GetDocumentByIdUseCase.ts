import { Document } from "../../../domain/entities/Document";
import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { AppError } from "../../../shared/errors/AppError";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";

export class GetDocumentByIdUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(documentId: string, ownerId: string): Promise<Document> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new AppError(APP_MESSAGE.DOCUMENT_NOT_FOUND, 404);
    }

    if (document.ownerId !== ownerId) {
      throw new AppError(APP_MESSAGE.UNAUTHORIZED_DOCUMENT_ACCESS, 403);
    }

    return document;
  }
}
