import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecruitmentLog,
  RecruitmentLogSchema,
} from './schemas/recruitment-log.schema';
import { RecruitmentLogRepository } from './recruitment-log.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecruitmentLog.name, schema: RecruitmentLogSchema },
    ]),
  ],
  providers: [RecruitmentLogRepository],
  exports: [RecruitmentLogRepository],
})
export class RecruitmentLogModule {}
