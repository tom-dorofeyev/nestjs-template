import { Injectable } from '@nestjs/common';
import { Transaction } from 'sagalicious';
import { LogService } from 'src/common/log/log.service';
import { RecruitmentLogRepository } from 'src/recruitment-log/recruitment-log.repository';
import { ISagaStepHandler } from './step-handler.interface';
import {
  LogRecruitmentCommand,
  RecruitmentSagaMetadata,
} from '../recruitment-saga.types';

@Injectable()
export class LogRecruitmentHandler implements ISagaStepHandler {
  constructor(
    private readonly repo: RecruitmentLogRepository,
    private readonly log: LogService,
  ) {}

  async execute(cmd: LogRecruitmentCommand, tx: Transaction): Promise<void> {
    const meta = tx.metadata as RecruitmentSagaMetadata;
    const steps = meta.stepResults.map((s) => ({
      stepOrder: s.stepOrder,
      commandType: s.commandType,
      status: s.status,
      error: s.error,
      timestamp: new Date(s.timestamp),
    }));
    await this.repo.create({
      heroId: cmd.heroId,
      status: 'COMPLETED',
      steps,
    });
  }

  async rollback(cmd: LogRecruitmentCommand, tx: Transaction): Promise<void> {
    try {
      await this.repo.deleteByHeroId(cmd.heroId);
    } catch (err) {
      this.log.error(
        `Rollback log-recruitment failed for hero ${cmd.heroId}: ${(err as Error).message}`,
      );
    }
  }
}
