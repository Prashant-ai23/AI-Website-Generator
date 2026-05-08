import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Global error handling middleware
 * Catches all errors and returns formatted response
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  // Handle ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    // Handle standard Error instances
    message = err.message || 'Internal Server Error';

    // Handle specific error types
    if ('statusCode' in err) {
      statusCode = (err as any).statusCode || 500;
    }
  }

  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${statusCode}] ${message}`, err);
  }

  // Send error response
  res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      {
        message,
        errors,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      message,
      false
    )
  );
}

/**
 * 404 Not Found middleware
 * Handle routes that don't exist
 */
export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
}
