
import { NextFunction, Request, Response } from "express";

export class HttpException extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) return next(err);

  // Handle known custom HttpException
  if (err instanceof HttpException) {
    return res.status(err.status).json({
      status: err.status,
      success: false,
      message: err.message,
    });
  }

  // Handle Multer errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: err.message,
    });
  }

  // Fallback: unknown error
  console.error("Unhandled error:", err);

  return res.status(500).json({
    status: 500,
    success: false,
    message: "Internal Server Error",
  });
}
