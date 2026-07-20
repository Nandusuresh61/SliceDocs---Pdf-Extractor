import { DocumentController } from "../controllers/DocumentController";
import { UploadPdfUseCase } from "../../application/usecase/pdf/UploadPdfUseCase"; 
import { GetMyFilesUseCase } from "../../application/usecase/pdf/GetMyFilesUseCase";

import { MongoDocumentRepository } from "../../infrastructure/repositories/DocumentRepository"; 
import { CloudinaryStorageService } from "../../infrastructure/storage/CloudinaryStorageService";

const documentRepository = new MongoDocumentRepository();

const storageService = new CloudinaryStorageService();

const uploadPdfUseCase = new UploadPdfUseCase(
  documentRepository,
  storageService
);

const getMyFilesUseCase = new GetMyFilesUseCase(documentRepository);

export const documentController = new DocumentController(
  uploadPdfUseCase,
  getMyFilesUseCase
);