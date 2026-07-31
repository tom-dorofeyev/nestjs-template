import { Injectable } from '@nestjs/common';
import { Transaction } from 'sagalicious';
import { LogService } from 'src/common/log/log.service';
import { EquipmentRepository } from 'src/equipment/equipment.repository';
import { ISagaStepHandler } from './step-handler.interface';
import {
  AssignEquipmentCommand,
  RecruitmentSagaMetadata,
} from '../recruitment-saga.types';

@Injectable()
export class AssignEquipmentHandler implements ISagaStepHandler {
  constructor(
    private readonly repo: EquipmentRepository,
    private readonly log: LogService,
  ) {}

  async execute(cmd: AssignEquipmentCommand, tx: Transaction): Promise<void> {
    const assigned: string[] = [];
    for (const eqId of cmd.equipmentIds) {
      const result = await this.repo.assignToHero(eqId, cmd.heroId);
      if (!result) throw new Error(`Equipment ${eqId} is not available`);
      assigned.push(eqId);
    }
    if (tx.metadata)
      (tx.metadata as RecruitmentSagaMetadata).assignedEquipmentIds = assigned;
  }

  async rollback(cmd: AssignEquipmentCommand, tx: Transaction): Promise<void> {
    try {
      const assigned: string[] =
        (tx.metadata as RecruitmentSagaMetadata)?.assignedEquipmentIds || [];
      for (const eqId of assigned) {
        await this.repo.releaseFromHero(eqId);
      }
    } catch (err) {
      this.log.error(
        `Rollback assign-equipment failed for hero ${cmd.heroId}: ${(err as Error).message}`,
      );
    }
  }
}
