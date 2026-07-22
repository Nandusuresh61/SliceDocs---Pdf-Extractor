import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { IStorageService } from "../../interface/IStorageService";
import { AppError } from "../../../shared/errors/AppError";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../../shared/constants/HttpStatus";

import { IDownloadPdfUseCase } from "../../interface/usecase/IDownloadPdfUseCase";

export class DownloadPdfUseCase implements IDownloadPdfUseCase {
  constructor(
    private readonly _documentRepository: IDocumentRepository,
    private readonly _storageService: IStorageService
  ) {}

  async execute(documentId: string, ownerId: string): Promise<{ buffer: Buffer, originalName: string }> {
    const document = await this._documentRepository.findById(documentId);
    
    if (!document) {
      throw new AppError(APP_MESSAGE.DOCUMENT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (document.ownerId !== ownerId) {
      throw new AppError(APP_MESSAGE.UNAUTHORIZED_DOCUMENT_ACCESS, HTTP_STATUS.FORBIDDEN);
    }

    try {
      const buffer = await this._storageService.download(document.url);
      return { buffer, originalName: document.originalName };
    } catch (_error) {
      throw new AppError(APP_MESSAGE.RETRIEVE_PDF_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
