import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { LogService } from 'src/common/log/log.service';
import { SuperheroRepository } from 'src/superheroes/superhero.repository';
import { ValidateHeroHandler } from './validate-hero.handler';
import { ValidateHeroCommand } from '../recruitment-saga.types';

describe('ValidateHeroHandler', () => {
  let handler: ValidateHeroHandler;
  let repo: jest.Mocked<SuperheroRepository>;
  let log: jest.Mocked<LogService>;

  const mockTx = { id: 'tx-1', metadata: {} } as any;

  const makeCommand = (): ValidateHeroCommand => ({
    type: 'validate-hero',
    heroId: 'hero-1',
    teamName: 'Avengers',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateHeroHandler,
        {
          provide: SuperheroRepository,
          useValue: {
            tryLockForRecruitment: jest.fn(),
            findOne: jest.fn(),
            releaseFromRecruitment: jest.fn(),
          },
        },
        {
          provide: LogService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(ValidateHeroHandler);
    repo = module.get(SuperheroRepository);
    log = module.get(LogService);
  });

  describe('execute', () => {
    it('throws NotFoundException when hero does not exist', async () => {
      repo.tryLockForRecruitment.mockResolvedValue(null);
      repo.findOne.mockResolvedValue(null);

      await expect(handler.execute(makeCommand(), mockTx)).rejects.toThrow(
        NotFoundException,
      );
      await expect(handler.execute(makeCommand(), mockTx)).rejects.toThrow(
        'Superhero hero-1 not found',
      );
    });

    it('throws ConflictException when hero has already been recruited', async () => {
      repo.tryLockForRecruitment.mockResolvedValue(null);
      repo.findOne.mockResolvedValue({ id: 'hero-1' } as any);

      await expect(handler.execute(makeCommand(), mockTx)).rejects.toThrow(
        ConflictException,
      );
      await expect(handler.execute(makeCommand(), mockTx)).rejects.toThrow(
        'Superhero hero-1 has already been recruited',
      );
    });

    it('succeeds when hero is locked successfully', async () => {
      const lockedHero = { id: 'hero-1', recruitmentStatus: 'RECRUITED' };
      repo.tryLockForRecruitment.mockResolvedValue(lockedHero as any);

      await expect(
        handler.execute(makeCommand(), mockTx),
      ).resolves.toBeUndefined();
      expect(repo.tryLockForRecruitment).toHaveBeenCalledWith(
        'hero-1',
        'Avengers',
      );
    });
  });

  describe('rollback', () => {
    it('calls repo.releaseFromRecruitment', async () => {
      repo.releaseFromRecruitment.mockResolvedValue({ id: 'hero-1' } as any);

      await handler.rollback(makeCommand(), mockTx);

      expect(repo.releaseFromRecruitment).toHaveBeenCalledWith('hero-1');
    });

    it('catches error when releaseFromRecruitment throws and does not propagate', async () => {
      const err = new Error('DB error');
      repo.releaseFromRecruitment.mockRejectedValue(err);

      await expect(
        handler.rollback(makeCommand(), mockTx),
      ).resolves.toBeUndefined();

      expect(log.error).toHaveBeenCalledWith(
        expect.stringContaining('Rollback validate-hero failed'),
      );
    });
  });
});
