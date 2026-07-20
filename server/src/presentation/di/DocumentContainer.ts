import { DocumentController } from "../controllers/DocumentController";
import { UploadPdfUseCase } from "../../application/usecase/pdf/UploadPdfUseCase"; 
import { GetMyFilesUseCase } from "../../application/usecase/pdf/GetMyFilesUseCase";
import { ExtractPdfUseCase } from "../../application/usecase/pdf/ExtractPdfUseCase";
import { GetDocumentByIdUseCase } from "../../application/usecase/pdf/GetDocumentByIdUseCase";
import { DownloadPdfUseCase } from "../../application/usecase/pdf/DownloadPdfUseCase";

import { MongoDocumentRepository } from "../../infrastructure/repositories/DocumentRepository"; 
import { S3StorageService } from "../../infrastructure/storage/S3StorageService";

const documentRepository = new MongoDocumentRepository();

const storageService = new S3StorageService();

const uploadPdfUseCase = new UploadPdfUseCase(
  documentRepository,
  storageService
);

const getMyFilesUseCase = new GetMyFilesUseCase(documentRepository);
const extractPdfUseCase = new ExtractPdfUseCase(documentRepository, storageService);
const getDocumentByIdUseCase = new GetDocumentByIdUseCase(documentRepository);
const downloadPdfUseCase = new DownloadPdfUseCase(documentRepository, storageService);

export const documentController = new DocumentController(
  uploadPdfUseCase,
  getMyFilesUseCase,
  extractPdfUseCase,
  getDocumentByIdUseCase,
  downloadPdfUseCase
);