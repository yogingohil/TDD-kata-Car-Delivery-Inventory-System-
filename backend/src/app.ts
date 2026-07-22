import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.config.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { requestIdMiddleware } from './middlewares/request-id.middleware.js';
import { AppError } from './utils/app-error.js';
import { HttpStatus } from './constants/http-status.js';
import { swaggerSpec } from './config/swagger.js';

const app: Application = express();

// Security & Parsing Middlewares
app.use(helmet());
app.use(requestIdMiddleware);
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger OpenAPI Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Base Routes
app.use('/api/v1', apiRouter);

// Support fallback route /api/auth if client requests without /v1
app.use('/api', apiRouter);

// 404 Route Handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, HttpStatus.NOT_FOUND));
});

// Global Error Handler
app.use(errorHandler);

export default app;
