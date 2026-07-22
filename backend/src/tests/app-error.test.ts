import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

describe('AppError Class', () => {
  it('should construct operational AppError with given message and status code', () => {
    const error = new AppError('Unauthorized access', HttpStatus.UNAUTHORIZED);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Unauthorized access');
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(error.isOperational).toBe(true);
  });

  it('should default to 500 Internal Server Error if status code omitted', () => {
    const error = new AppError('Database connection error');

    expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
