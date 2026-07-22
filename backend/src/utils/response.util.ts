import { Response } from 'express';
import { HttpStatusCode, HttpStatus } from '../constants/http-status.js';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    statusCode: HttpStatusCode = HttpStatus.OK,
    message: string,
    data?: T,
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
    };
    return res.status(statusCode).json(payload);
  }

  public static error(
    res: Response,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string,
    errors?: Array<{ field?: string; message: string }>,
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      ...(errors && errors.length > 0 && { errors }),
    };
    return res.status(statusCode).json(payload);
  }
}
