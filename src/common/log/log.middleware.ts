import { Injectable, NestMiddleware } from '@nestjs/common';
import { LogService } from './log.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const baseMessage = `${req.method} - ${req.originalUrl}`;
    this.logService.log(baseMessage);

    res.on('finish', () => {
      const message = `${baseMessage} responded with ${res.statusCode}`;
      this.logService.log(message);
    });
    next();
  }
}
