import { Module } from '@nestjs/common';
import { SuperheroController } from './superhero.controller';
import { SuperheroRepository } from './superhero.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Superhero, SuperheroSchema } from './schemas/superhero.schema';
import { SuperheroService } from './superhero.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Superhero.name, schema: SuperheroSchema },
    ]),
  ],
  controllers: [SuperheroController],
  providers: [SuperheroRepository, SuperheroService],
  exports: [SuperheroRepository],
})
export class SuperheroModule {}
