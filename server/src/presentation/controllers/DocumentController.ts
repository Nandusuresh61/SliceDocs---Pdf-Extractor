import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { IUploadPdfUseCase } from "../../application/interface/usecase/IUploadPdfUseCase";
import { IGetMyFilesUseCase } from "../../application/interface/usecase/IGetMyFilesUseCase";
import { IExtractPdfUseCase } from "../../application/interface/usecase/IExtractPdfUseCase";
import { IGetDocumentByIdUseCase } from "../../application/interface/usecase/IGetDocumentByIdUseCase";
import { IDownloadPdfUseCase } from "../../application/interface/usecase/IDownloadPdfUseCase";
import { AppError } from "../../shared/errors/AppError";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { ApiResponse } from "../../shared/response/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { DocumentMapper } from "../../application/mappers/DocumentMapper";

export class DocumentController {
  constructor(
    private readonly _uploadPdfUseCase: IUploadPdfUseCase,
    private readonly _getMyFilesUseCase: IGetMyFilesUseCase,
    private readonly _extractPdfUseCase: IExtractPdfUseCase,
    private readonly _getDocumentByIdUseCase: IGetDocumentByIdUseCase,
    private readonly _downloadPdfUseCase: IDownloadPdfUseCase
  ) { }

  upload = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError(
        APP_MESSAGE.PDF_REQUIRED,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODE.FILE_REQUIRED,
      );
    }

    const document = await this._uploadPdfUseCase.execute({
      file: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      ownerId: req.user?.id,
    });

    const documentResponse = DocumentMapper.toResponse(document);

    return ApiResponse.success(
      res,
      documentResponse,
      APP_MESSAGE.PDF_UPLOADED,
      HTTP_STATUS.CREATED,
    );
  });

  getMyFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(
        APP_MESSAGE.AUTH_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      );
    }

    const documents = await this._getMyFilesUseCase.execute(req.user.id);
    const documentResponses = documents.map(doc => DocumentMapper.toResponse(doc));

    return ApiResponse.success(
      res,
      documentResponses,
      APP_MESSAGE.FILES_RETRIEVED,
      HTTP_STATUS.OK,
    );
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(
        APP_MESSAGE.AUTH_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      );
    }

    const documentId = req.params.id as string;
    const document = await this._getDocumentByIdUseCase.execute(documentId, req.user.id);
    
    return ApiResponse.success(
      res,
      DocumentMapper.toResponse(document),
      APP_MESSAGE.DOCUMENT_RETRIEVED,
      HTTP_STATUS.OK,
    );
  });

  extract = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(
        APP_MESSAGE.AUTH_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      );
    }

    const documentId = req.params.id as string;
    const { selectedPages } = req.body;

    const document = await this._extractPdfUseCase.execute(documentId, req.user.id, selectedPages);
    
    return ApiResponse.success(
      res,
      DocumentMapper.toResponse(document),
      APP_MESSAGE.PAGES_EXTRACTED,
      HTTP_STATUS.CREATED,
    );
  });

  download = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      throw new AppError(
        APP_MESSAGE.AUTH_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODE.UNAUTHORIZED
      );
    }

    const documentId = req.params.id as string;
    
    try {
      const { buffer, originalName } = await this._downloadPdfUseCase.execute(documentId, req.user.id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
      res.send(buffer);
    } catch (err) {
      console.error("Error in download method:", err);
      throw err;
    }
  });
}
