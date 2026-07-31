import { Injectable } from '@nestjs/common';
import { Transaction } from 'sagalicious';
import { HttpService } from 'src/common/http/http.service';
import { LogService } from 'src/common/log/log.service';
import { ISagaStepHandler } from './step-handler.interface';
import { NotifyHQCommand } from '../recruitment-saga.types';

@Injectable()
export class NotifyHQHandler implements ISagaStepHandler {
  constructor(
    private readonly http: HttpService,
    private readonly log: LogService,
  ) {}

  async execute(cmd: NotifyHQCommand, tx: Transaction): Promise<void> {
    const baseUrl = process.env.HQ_API_URL || 'http://localhost:9999/api/hq';
    await this.http.post(
      `${baseUrl}/notifications`,
      {
        heroId: cmd.heroId,
        teamName: cmd.teamName,
        transactionId: tx.id,
      },
      undefined,
      { timeout: 5000 },
    );
  }

  async rollback(cmd: NotifyHQCommand, tx: Transaction): Promise<void> {
    try {
      const baseUrl = process.env.HQ_API_URL || 'http://localhost:9999/api/hq';
      await this.http.post(
        `${baseUrl}/notifications/cancel`,
        {
          heroId: cmd.heroId,
          transactionId: tx.id,
        },
        undefined,
        { timeout: 5000 },
      );
    } catch (err) {
      this.log.warn(
        `HQ cancellation failed for transaction ${tx.id}: ${(err as Error).message}`,
      );
    }
  }
}
