import { Document } from "../../../domain/entities/Document";
import { PDFDocument } from "pdf-lib";
import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { IStorageService } from "../../interface/IStorageService";
import { DocumentType } from "../../../domain/types/DocumentType";
import { AppError } from "../../../shared/errors/AppError";
import { APP_MESSAGE } from "../../../shared/messages/AppMessage";

import { IExtractPdfUseCase } from "../../interface/usecase/IExtractPdfUseCase";

export class ExtractPdfUseCase implements IExtractPdfUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(documentId: string, ownerId: string, selectedPages: number[]): Promise<Document> {
    if (!selectedPages || selectedPages.length === 0) {
      throw new AppError(APP_MESSAGE.NO_PAGES_SELECTED, 400);
    }

    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new AppError(APP_MESSAGE.DOCUMENT_NOT_FOUND, 404);
    }

    if (document.ownerId !== ownerId) {
      throw new AppError(APP_MESSAGE.UNAUTHORIZED_DOCUMENT_ACCESS, 403);
    }

    // Fetch the original PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.storageService.download(document.url);
    } catch (error) {
      throw new AppError(APP_MESSAGE.RETRIEVE_PDF_FAILED, 500);
    }

    // Load original PDF
    const originalPdf = await PDFDocument.load(pdfBuffer);
    
    // Create new PDF
    const newPdf = await PDFDocument.create();
    
    // Extract pages. Note: selectedPages are 1-indexed, PDFDocument uses 0-indexed.
    const indicesToCopy = selectedPages.map(page => page - 1);
    
    try {
      const copiedPages = await newPdf.copyPages(originalPdf, indicesToCopy);
      for (const copiedPage of copiedPages) {
        newPdf.addPage(copiedPage);
      }
    } catch (error) {
      throw new AppError(APP_MESSAGE.EXTRACTION_FAILED, 400);
    }

    // Save new PDF to buffer
    const newPdfBytes = await newPdf.save();
    const newPdfBuffer = Buffer.from(newPdfBytes);

    // Generate new filename
    const originalNameWithoutExt = document.originalName.replace(/\.pdf$/i, "");
    const newFileName = `${originalNameWithoutExt}_extracted_${Date.now()}.pdf`;

    // Upload new PDF
    const uploadedFile = await this.storageService.upload(
      newPdfBuffer,
      newFileName
    );

    // Save metadata
    const extractedDocument = new Document({
      ownerId,
      originalName: newFileName,
      storageId: uploadedFile.storageId,
      url: uploadedFile.url,
      pageCount: selectedPages.length,
      size: newPdfBuffer.length,
      type: DocumentType.GENERATED,
    });

    const savedDocument = await this.documentRepository.save(extractedDocument);

    return savedDocument;
  }
}
