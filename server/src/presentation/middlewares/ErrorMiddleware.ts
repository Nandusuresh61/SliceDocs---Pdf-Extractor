import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { ERROR_CODE } from "../../shared/constants/ErrorCode";
import { HTTP_STATUS } from "../../shared/constants/HttpStatus";
import { ApiResponse } from "../../shared/response/responseHandler";
import { APP_MESSAGE } from "../../shared/messages/AppMessage";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errorCode
    );
  }

  console.error(err);

  return ApiResponse.error(
    res,
    APP_MESSAGE.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INTERNAL_SERVER_ERROR
  );
};