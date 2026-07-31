import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { Superhero } from './schemas/superhero.schema';

@Injectable()
export class SuperheroRepository extends BaseRepository<Superhero> {
  constructor(@InjectModel(Superhero.name) model: Model<Superhero>) {
    super(model);
  }

  async tryLockForRecruitment(
    heroId: string,
    teamName: string,
  ): Promise<Superhero | null> {
    return this.model
      .findOneAndUpdate(
        { id: heroId, recruitmentStatus: 'AVAILABLE' },
        { recruitmentStatus: 'RECRUITED', teamName },
        { new: true },
      )
      .exec();
  }

  async releaseFromRecruitment(heroId: string): Promise<Superhero | null> {
    return this.model
      .findOneAndUpdate(
        { id: heroId },
        { recruitmentStatus: 'AVAILABLE', teamName: null },
        { new: true },
      )
      .exec();
  }
}
