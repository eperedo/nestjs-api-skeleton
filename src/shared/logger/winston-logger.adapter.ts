import type { Logger as WinstonLogger } from 'winston';
import type { Logger, LogMeta } from 'src/shared/domain/Logger';

export class WinstonLoggerAdapter implements Logger {
  constructor(private readonly logger: WinstonLogger) {}

  info(message: string, meta?: LogMeta): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: LogMeta): void {
    this.logger.debug(message, meta);
  }
}
