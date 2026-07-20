import { Document } from "../../../domain/entities/Document";
import { PDFDocument } from "pdf-lib";
import { IDocumentRepository } from "../../interface/IDocumentRepository";
import { IStorageService } from "../../interface/IStorageService";
import { UploadPdfDto } from "../../dto/UploadPdfDto";
import { DocumentType } from "../../../domain/types/DocumentType";

export class UploadPdfUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(input: UploadPdfDto): Promise<Document> {
    const pdf = await PDFDocument.load(input.file);
    const pageCount = pdf.getPageCount();

    const uploadedFile = await this.storageService.upload(
      input.file,
      input.originalName
    );

    const document = new Document({
      ownerId: input.ownerId,
      originalName: input.originalName,
      storageId: uploadedFile.storageId,
      url: uploadedFile.url,
      pageCount, 
      size: input.size,
      type: DocumentType.ORIGINAL,
    });

    const savedDocument = await this.documentRepository.save(document);

    return savedDocument;
  }
}