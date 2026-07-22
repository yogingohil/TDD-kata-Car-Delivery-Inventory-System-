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

// Permissive Cross-Origin Resource Sharing (CORS) for Vercel & Production Clients
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin === env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Endpoint (when hitting GET / directly)
app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers.accept?.includes('text/html')) {
    res.status(HttpStatus.OK).json({
      message: 'Welcome to APEX MOTORS Car Delivery & Inventory Management API',
      swaggerDocs: '/api-docs',
      healthCheck: '/api/v1/health',
      status: 'online',
    });
    return;
  }
  next();
});

// Health check endpoints
const healthHandler = (_req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: 'healthy',
    service: 'Car Inventory System API',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Swagger OpenAPI Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Base Routes with fail-proof fallbacks for /api/v1, /api, and root /
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 Route Handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, HttpStatus.NOT_FOUND));
});

// Global Error Handler
app.use(errorHandler);

export default app;
