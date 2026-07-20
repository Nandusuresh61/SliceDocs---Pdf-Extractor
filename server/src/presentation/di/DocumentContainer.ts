import { DocumentController } from "../controllers/DocumentController";
import { UploadPdfUseCase } from "../../application/usecase/pdf/UploadPdfUseCase"; 

import { MongoDocumentRepository } from "../../infrastructure/repositories/DocumentRepository"; 
import { CloudinaryStorageService } from "../../infrastructure/storage/CloudinaryStorageService";

const documentRepository = new MongoDocumentRepository();

const storageService = new CloudinaryStorageService();

const uploadPdfUseCase = new UploadPdfUseCase(
  documentRepository,
  storageService
);

export const documentController = new DocumentController(
  uploadPdfUseCase
);