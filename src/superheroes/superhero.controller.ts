import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSuperHeroDto } from './dto/create.superhero.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ISuperhero } from './schemas/superhero.schema';
import { SuperheroResponseDto } from './dto/superhero.response.dto';
import { SuperheroService } from './superhero.service';

@Controller('superheroes')
export class SuperheroController {
  constructor(private readonly service: SuperheroService) {}

  @ApiCreatedResponse({
    description: 'Superhero created successfully',
    type: SuperheroResponseDto,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateSuperHeroDto,
  ): Promise<ISuperhero> {
    try {
      const created = await this.service.create(dto);
      return SuperheroResponseDto.fromSuperhero(created);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiResponse({ status: 200, type: [SuperheroResponseDto] })
  @Get()
  async list(): Promise<ISuperhero[]> {
    try {
      const found = await this.service.find();
      return SuperheroResponseDto.fromSuperheroList(found);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiResponse({ status: 200, type: SuperheroResponseDto })
  @ApiNotFoundResponse({ description: 'Superhero not found' })
  @ApiBadRequestResponse({ description: 'Invalid uuid' })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ISuperhero> {
    try {
      const found = await this.service.findById(id);
      if (!found) throw new NotFoundException(`Superhero ${id} not found`);
      return SuperheroResponseDto.fromSuperhero(found);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      else throw new InternalServerErrorException(err.message);
    }
  }
}
