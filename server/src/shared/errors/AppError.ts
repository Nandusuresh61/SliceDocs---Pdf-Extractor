import { HTTP_STATUS } from "../constants/HttpStatus";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HTTP_STATUS.BAD_REQUEST,
    public readonly errorCode?: string
  ) {
    super(message);

    this.name = "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}