import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { IStorageService } from "../../interface/IStorageService";
import { AppError } from "../../../shared/errors/AppError";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";

import { IDownloadPdfUseCase } from "../../interface/usecase/IDownloadPdfUseCase";

export class DownloadPdfUseCase implements IDownloadPdfUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(documentId: string, ownerId: string): Promise<{ buffer: Buffer, originalName: string }> {
    const document = await this.documentRepository.findById(documentId);
    
    if (!document) {
      throw new AppError(APP_MESSAGE.DOCUMENT_NOT_FOUND, 404);
    }

    if (document.ownerId !== ownerId) {
      throw new AppError(APP_MESSAGE.UNAUTHORIZED_DOCUMENT_ACCESS, 403);
    }

    try {
      const buffer = await this.storageService.download(document.url);
      return { buffer, originalName: document.originalName };
    } catch (error) {
      throw new AppError(APP_MESSAGE.RETRIEVE_PDF_FAILED, 500);
    }
  }
}
