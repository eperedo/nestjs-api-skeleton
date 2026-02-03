import { Module } from '@nestjs/common';
import { WinstonModule, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { format, transports } from 'winston';
import type { Logger as WinstonLogger } from 'winston';
import { LOGGER } from 'src/tokens/repository-tokens';
import { WinstonLoggerAdapter } from './winston-logger.adapter';

const createWinstonConfig = () => {
  const level = process.env.LOG_LEVEL ?? 'info';
  const useJson = (process.env.LOG_JSON ?? 'true') === 'true';
  const baseFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
  );
  const logFormat = useJson
    ? format.combine(baseFormat, format.json())
    : baseFormat;

  return {
    level,
    format: logFormat,
    transports: [new transports.Console()],
  };
};

@Module({
  imports: [WinstonModule.forRoot(createWinstonConfig())],
  providers: [
    {
      provide: LOGGER,
      useFactory: (logger: WinstonLogger) => new WinstonLoggerAdapter(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
  exports: [LOGGER, WinstonModule],
})
export class LoggerModule {}
