import app from './app.js';
import { env } from './config/env.config.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { autoSeedIfEmpty } from './utils/seed.js';
import { logger } from './utils/logger.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  // Automatic database check: seed default cars and admin accounts if DB is empty on server startup
  await autoSeedIfEmpty();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Server closed. Exit complete.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer();
