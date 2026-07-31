import { Module } from '@nestjs/common';
import { HttpModule } from 'src/common/http/http.module';
import { LogModule } from 'src/common/log/log.module';
import { SuperheroModule } from 'src/superheroes/superhero.module';
import { EquipmentModule } from 'src/equipment/equipment.module';
import { BadgeModule } from 'src/badge/badge.module';
import { RecruitmentLogModule } from 'src/recruitment-log/recruitment-log.module';
import { SagaTransactionModule } from 'src/saga-transaction/saga-transaction.module';
import { RecruitmentSagaService } from './recruitment-saga.service';
import { RecruitmentController } from './recruitment.controller';
import { ValidateHeroHandler } from './handlers/validate-hero.handler';
import { AssignEquipmentHandler } from './handlers/assign-equipment.handler';
import { IssueBadgeHandler } from './handlers/issue-badge.handler';
import { NotifyHQHandler } from './handlers/notify-hq.handler';
import { LogRecruitmentHandler } from './handlers/log-recruitment.handler';

@Module({
  imports: [
    HttpModule,
    LogModule,
    SuperheroModule,
    EquipmentModule,
    BadgeModule,
    RecruitmentLogModule,
    SagaTransactionModule,
  ],
  controllers: [RecruitmentController],
  providers: [
    RecruitmentSagaService,
    ValidateHeroHandler,
    AssignEquipmentHandler,
    IssueBadgeHandler,
    NotifyHQHandler,
    LogRecruitmentHandler,
  ],
})
export class SagaModule {}
