import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Transaction } from 'sagalicious';
import { LogService } from 'src/common/log/log.service';
import { SuperheroRepository } from 'src/superheroes/superhero.repository';
import { ISagaStepHandler } from './step-handler.interface';
import { ValidateHeroCommand } from '../recruitment-saga.types';

@Injectable()
export class ValidateHeroHandler implements ISagaStepHandler {
  constructor(
    private readonly repo: SuperheroRepository,
    private readonly log: LogService,
  ) {}

  async execute(cmd: ValidateHeroCommand, tx: Transaction): Promise<void> {
    const hero = await this.repo.tryLockForRecruitment(
      cmd.heroId,
      cmd.teamName,
    );
    if (!hero) {
      const existing = await this.repo.findOne({ id: cmd.heroId });
      if (!existing)
        throw new NotFoundException(`Superhero ${cmd.heroId} not found`);
      throw new ConflictException(
        `Superhero ${cmd.heroId} has already been recruited`,
      );
    }
  }

  async rollback(cmd: ValidateHeroCommand, tx: Transaction): Promise<void> {
    try {
      await this.repo.releaseFromRecruitment(cmd.heroId);
    } catch (err) {
      this.log.error(
        `Rollback validate-hero failed for hero ${cmd.heroId}: ${(err as Error).message}`,
      );
    }
  }
}
