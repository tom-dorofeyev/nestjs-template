import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createSaga, Transaction, TransactionStatus } from 'sagalicious';
import { LogService } from 'src/common/log/log.service';
import { MongooseTransactionRepository } from 'src/saga-transaction/mongoose-transaction.repository';
import { ValidateHeroHandler } from './handlers/validate-hero.handler';
import { AssignEquipmentHandler } from './handlers/assign-equipment.handler';
import { IssueBadgeHandler } from './handlers/issue-badge.handler';
import { NotifyHQHandler } from './handlers/notify-hq.handler';
import { LogRecruitmentHandler } from './handlers/log-recruitment.handler';
import {
  RecruitHeroResult,
  RecruitmentSagaMetadata,
  StepResult,
  ValidateHeroCommand,
  AssignEquipmentCommand,
  IssueBadgeCommand,
  NotifyHQCommand,
  LogRecruitmentCommand,
  RecruitmentCommand,
} from './recruitment-saga.types';

@Injectable()
export class RecruitmentSagaService {
  constructor(
    private readonly validateHero: ValidateHeroHandler,
    private readonly assignEquipment: AssignEquipmentHandler,
    private readonly issueBadge: IssueBadgeHandler,
    private readonly notifyHQ: NotifyHQHandler,
    private readonly logRecruitment: LogRecruitmentHandler,
    private readonly txRepo: MongooseTransactionRepository,
    private readonly log: LogService,
  ) {}

  async recruit(
    heroId: string,
    teamName: string,
    equipmentIds: string[],
  ): Promise<RecruitHeroResult> {
    const uniqueEquipmentIds = [...new Set(equipmentIds)];

    const metadata: RecruitmentSagaMetadata = {
      heroId,
      teamName,
      equipmentIds: uniqueEquipmentIds,
      badgeNumber: '',
      stepResults: [],
    };

    const transactionId = uuidv4();
    const commands: RecruitmentCommand[] = [
      { type: 'validate-hero', heroId, teamName },
      { type: 'assign-equipment', heroId, equipmentIds: uniqueEquipmentIds },
      { type: 'issue-badge', heroId },
      { type: 'notify-hq', heroId, teamName },
      {
        type: 'log-recruitment',
        heroId,
      },
    ];

    const saga = createSaga()
      .handler('validate-hero', this.wrap('validate-hero', this.validateHero))
      .handler(
        'assign-equipment',
        this.wrap('assign-equipment', this.assignEquipment),
      )
      .handler('issue-badge', this.wrap('issue-badge', this.issueBadge))
      .handler('notify-hq', this.wrap('notify-hq', this.notifyHQ))
      .handler(
        'log-recruitment',
        this.wrap('log-recruitment', this.logRecruitment),
      )
      .withRepository(this.txRepo)
      .build();

    try {
      await saga.execute(commands, { id: transactionId, metadata });

      const stepResults = metadata.stepResults;
      this.log.log(`[Saga] Recruitment COMPLETED for hero ${heroId}`);

      return {
        transactionId,
        status: 'COMPLETED',
        steps: stepResults,
        heroId,
        teamName,
        equipmentAssigned: metadata.assignedEquipmentIds || uniqueEquipmentIds,
        badgeNumber: metadata.badgeNumber,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const stepResults = metadata.stepResults;

      const completedCount = stepResults.length;
      const failedStep = completedCount + 1;

      const failedCommandType =
        completedCount < commands.length
          ? commands[completedCount].type
          : 'unknown';

      stepResults.push({
        stepOrder: failedStep,
        commandType: failedCommandType!,
        status: 'FAILED',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });

      for (let i = failedStep; i < commands.length; i++) {
        stepResults.push({
          stepOrder: i + 1,
          commandType: commands[i].type!,
          status: 'SKIPPED',
          timestamp: new Date().toISOString(),
        });
      }

      this.log.warn(
        `[Saga] Recruitment ROLLED_BACK for hero ${heroId}: ${errorMessage}`,
      );

      return {
        transactionId,
        status: 'ROLLED_BACK',
        steps: stepResults,
        heroId,
        error: errorMessage,
      };
    }
  }

  private wrap(
    commandType: string,
    handler: {
      execute: (cmd: any, tx: Transaction) => Promise<void>;
      rollback: (cmd: any, tx: Transaction) => Promise<void>;
    },
  ): {
    execute: (cmd: any, tx: Transaction) => Promise<void>;
    rollback: (cmd: any, tx: Transaction) => Promise<void>;
  } {
    const self = this;
    return {
      execute: async (cmd: any, tx: Transaction) => {
        self.log.log(
          `[Saga] Executing ${commandType} for hero ${(tx.metadata as any)?.heroId}`,
        );
        await handler.execute(cmd, tx);
        if (tx.metadata) {
          (tx.metadata as RecruitmentSagaMetadata).stepResults.push({
            stepOrder:
              (tx.metadata as RecruitmentSagaMetadata).stepResults.length + 1,
            commandType,
            status: 'SUCCESS',
            timestamp: new Date().toISOString(),
          });
        }
        self.log.log(`[Saga] ${commandType} SUCCESS`);
      },
      rollback: async (cmd: any, tx: Transaction) => {
        self.log.warn(`[Saga] Rolling back ${commandType}`);
        await handler.rollback(cmd, tx);
        self.log.log(`[Saga] ${commandType} rollback completed`);
      },
    };
  }
}
