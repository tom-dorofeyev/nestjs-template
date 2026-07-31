import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { RecruitmentLog } from './schemas/recruitment-log.schema';

@Injectable()
export class RecruitmentLogRepository extends BaseRepository<RecruitmentLog> {
  constructor(@InjectModel(RecruitmentLog.name) model: Model<RecruitmentLog>) {
    super(model);
  }

  async findByHeroId(heroId: string): Promise<RecruitmentLog[]> {
    return this.model.find({ heroId }).exec();
  }

  async deleteByHeroId(heroId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ heroId }).exec();
    return result.deletedCount > 0;
  }
}
