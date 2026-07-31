import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { Badge } from './schemas/badge.schema';

@Injectable()
export class BadgeRepository extends BaseRepository<Badge> {
  constructor(@InjectModel(Badge.name) model: Model<Badge>) {
    super(model);
  }

  async deleteByHeroId(heroId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ heroId }).exec();
    return result.deletedCount > 0;
  }

  async findByHeroId(heroId: string): Promise<Badge | null> {
    return this.model.findOne({ heroId }).exec();
  }
}
