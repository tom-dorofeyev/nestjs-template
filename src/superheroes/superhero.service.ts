import { Injectable } from '@nestjs/common';
import { SuperheroRepository } from './superhero.repository';
import { CreateSuperHeroDto } from './dto/create.superhero.dto';

@Injectable()
export class SuperheroService {
  constructor(private readonly repository: SuperheroRepository) {}

  async create(dto: CreateSuperHeroDto) {
    const result = await this.repository.create(dto);
    return result;
  }

  async find() {
    const result = await this.repository.findAll();
    return result;
  }

  async findById(id: string) {
    const result = await this.repository.findOne({ id });
    return result;
  }

  async getById(id: string) {
    const result = await this.repository.findOne({ id });
    return result;
  }
}
