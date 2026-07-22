import { Document } from "../../../domain/entities/Document";
import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { AppError } from "../../../shared/errors/AppError";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../../shared/constants/HttpStatus";

import { IGetDocumentByIdUseCase } from "../../interface/usecase/IGetDocumentByIdUseCase";

export class GetDocumentByIdUseCase implements IGetDocumentByIdUseCase {
  constructor(private readonly _documentRepository: IDocumentRepository) {}

  async execute(documentId: string, ownerId: string): Promise<Document> {
    const document = await this._documentRepository.findById(documentId);
    if (!document) {
      throw new AppError(APP_MESSAGE.DOCUMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (document.ownerId !== ownerId) {
      throw new AppError(APP_MESSAGE.UNAUTHORIZED_DOCUMENT_ACCESS, HTTP_STATUS.FORBIDDEN);
    }

    return document;
  }
}
