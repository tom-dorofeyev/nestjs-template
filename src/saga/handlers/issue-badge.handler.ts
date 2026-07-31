import { Injectable } from '@nestjs/common';
import { Transaction } from 'sagalicious';
import { LogService } from 'src/common/log/log.service';
import { BadgeRepository } from 'src/badge/badge.repository';
import { ISagaStepHandler } from './step-handler.interface';
import {
  IssueBadgeCommand,
  RecruitmentSagaMetadata,
} from '../recruitment-saga.types';

@Injectable()
export class IssueBadgeHandler implements ISagaStepHandler {
  constructor(
    private readonly repo: BadgeRepository,
    private readonly log: LogService,
  ) {}

  async execute(cmd: IssueBadgeCommand, tx: Transaction): Promise<void> {
    const badgeNumber = `BADGE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await this.repo.create({ badgeNumber, heroId: cmd.heroId });
    if (tx.metadata)
      (tx.metadata as RecruitmentSagaMetadata).badgeNumber = badgeNumber;
  }

  async rollback(cmd: IssueBadgeCommand, tx: Transaction): Promise<void> {
    try {
      await this.repo.deleteByHeroId(cmd.heroId);
    } catch (err) {
      this.log.error(
        `Rollback issue-badge failed for hero ${cmd.heroId}: ${(err as Error).message}`,
      );
    }
  }
}
