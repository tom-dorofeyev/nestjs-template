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
}
