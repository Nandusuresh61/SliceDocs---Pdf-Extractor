import { Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    data: unknown,
    message: string,
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string,
    statusCode: number,
    errorCode?: string
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errorCode,
    });
  }
}