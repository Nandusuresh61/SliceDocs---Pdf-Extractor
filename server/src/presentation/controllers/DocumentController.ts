import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { UploadPdfUseCase } from "../../application/usecase/pdf/UploadPdfUseCase";
import { GetMyFilesUseCase } from "../../application/usecase/pdf/GetMyFilesUseCase";
import { AppError } from "../../shared/errors/AppError";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { ApiResponse } from "../../shared/response/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { DocumentMapper } from "../../application/mappers/DocumentMapper";

export class DocumentController {
  constructor(
    private readonly _uploadPdfUseCase: UploadPdfUseCase,
    private readonly _getMyFilesUseCase: GetMyFilesUseCase
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
      "Files retrieved successfully",
      HTTP_STATUS.OK,
    );
  });
}
