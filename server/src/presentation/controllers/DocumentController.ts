import { Request, Response } from "express";
import { UploadPdfUseCase } from "../../application/usecase/pdf/UploadPdfUseCase";
import { AppError } from "../../shared/errors/AppError";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { ApiResponse } from "../../shared/response/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { DocumentMapper } from "../../application/mappers/DocumentMapper";

export class DocumentController {
  constructor(private readonly _uploadPdfUseCase: UploadPdfUseCase) { }

  upload = asyncHandler(async (req: Request, res: Response) => {
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
    });

    const documentResponse = DocumentMapper.toResponse(document);

    return ApiResponse.success(
      res,
      documentResponse,
      APP_MESSAGE.PDF_UPLOADED,
      HTTP_STATUS.CREATED,
    );
  });
}
