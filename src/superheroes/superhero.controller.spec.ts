import { Test, TestingModule } from '@nestjs/testing';
import { ISuperhero } from './schemas/superhero.schema';
import { SuperheroController } from './superhero.controller';
import { SuperheroResponseDto } from './dto/superhero.response.dto';
import { CreateSuperHeroDto } from './dto/create.superhero.dto';
import { SuperheroService } from './superhero.service';

describe('SuperheroesController', () => {
  let controller: SuperheroController;
  let service: jest.Mocked<SuperheroService>;

  const mockSuperhero: ISuperhero = {
    id: 'uuid-123',
    name: 'Bruce Wayne',
    alias: 'Batman',
    powers: ['Money'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroController],
      providers: [
        {
          provide: SuperheroService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SuperheroController>(SuperheroController);
    service = module.get(SuperheroService);
  });

  describe('create', () => {
    it('should create and return a superhero', async () => {
      const dto: CreateSuperHeroDto = {
        name: 'Bruce Wayne',
        alias: 'Batman',
        powers: ['Money'],
      };
      service.create.mockResolvedValue(mockSuperhero);
      jest
        .spyOn(SuperheroResponseDto, 'fromSuperhero')
        .mockReturnValue(mockSuperhero);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockSuperhero);
    });
  });
});
