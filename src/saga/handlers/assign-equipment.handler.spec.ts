import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from 'src/common/log/log.service';
import { EquipmentRepository } from 'src/equipment/equipment.repository';
import { AssignEquipmentHandler } from './assign-equipment.handler';
import {
  AssignEquipmentCommand,
  RecruitmentSagaMetadata,
} from '../recruitment-saga.types';

describe('AssignEquipmentHandler', () => {
  let handler: AssignEquipmentHandler;
  let repo: jest.Mocked<EquipmentRepository>;
  let log: jest.Mocked<LogService>;

  const makeCommand = (): AssignEquipmentCommand => ({
    type: 'assign-equipment',
    heroId: 'hero-1',
    equipmentIds: ['eq-1', 'eq-2', 'eq-3'],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignEquipmentHandler,
        {
          provide: EquipmentRepository,
          useValue: {
            assignToHero: jest.fn(),
            releaseFromHero: jest.fn(),
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

    handler = module.get(AssignEquipmentHandler);
    repo = module.get(EquipmentRepository);
    log = module.get(LogService);
  });

  describe('execute', () => {
    it('assigns equipment sequentially and stores assigned IDs in metadata', async () => {
      const tx = { id: 'tx-1', metadata: {} as RecruitmentSagaMetadata };
      repo.assignToHero
        .mockResolvedValueOnce({ id: 'eq-1', status: 'ASSIGNED' } as any)
        .mockResolvedValueOnce({ id: 'eq-2', status: 'ASSIGNED' } as any)
        .mockResolvedValueOnce({ id: 'eq-3', status: 'ASSIGNED' } as any);

      await handler.execute(makeCommand(), tx as any);

      expect(repo.assignToHero).toHaveBeenCalledTimes(3);
      expect(repo.assignToHero).toHaveBeenNthCalledWith(1, 'eq-1', 'hero-1');
      expect(repo.assignToHero).toHaveBeenNthCalledWith(2, 'eq-2', 'hero-1');
      expect(repo.assignToHero).toHaveBeenNthCalledWith(3, 'eq-3', 'hero-1');
      expect(tx.metadata.assignedEquipmentIds).toEqual([
        'eq-1',
        'eq-2',
        'eq-3',
      ]);
    });

    it('throws when an equipment item is not available', async () => {
      const tx = { id: 'tx-1', metadata: {} as RecruitmentSagaMetadata };
      repo.assignToHero
        .mockResolvedValueOnce({ id: 'eq-1', status: 'ASSIGNED' } as any)
        .mockResolvedValueOnce(null as any);

      await expect(handler.execute(makeCommand(), tx as any)).rejects.toThrow(
        'Equipment eq-2 is not available',
      );

      expect(tx.metadata.assignedEquipmentIds).toBeUndefined();
    });

    it('does not set metadata when tx.metadata is undefined', async () => {
      const tx = { id: 'tx-1' };
      repo.assignToHero.mockResolvedValue({
        id: 'eq-1',
        status: 'ASSIGNED',
      } as any);

      await handler.execute(
        { ...makeCommand(), equipmentIds: ['eq-1'] },
        tx as any,
      );

      expect(tx).not.toHaveProperty('metadata');
    });
  });

  describe('rollback', () => {
    it('releases all assigned equipment from metadata', async () => {
      const tx = {
        id: 'tx-1',
        metadata: {
          assignedEquipmentIds: ['eq-1', 'eq-3'],
        } as RecruitmentSagaMetadata,
      };
      repo.releaseFromHero.mockResolvedValue({} as any);

      await handler.rollback(makeCommand(), tx as any);

      expect(repo.releaseFromHero).toHaveBeenCalledTimes(2);
      expect(repo.releaseFromHero).toHaveBeenCalledWith('eq-1');
      expect(repo.releaseFromHero).toHaveBeenCalledWith('eq-3');
    });

    it('releases nothing when assignedEquipmentIds is empty', async () => {
      const tx = {
        id: 'tx-1',
        metadata: {} as RecruitmentSagaMetadata,
      };

      await handler.rollback(makeCommand(), tx as any);

      expect(repo.releaseFromHero).not.toHaveBeenCalled();
    });

    it('catches release errors and does not propagate', async () => {
      const tx = {
        id: 'tx-1',
        metadata: { assignedEquipmentIds: ['eq-1'] } as RecruitmentSagaMetadata,
      };
      repo.releaseFromHero.mockRejectedValue(new Error('DB error'));

      await expect(
        handler.rollback(makeCommand(), tx as any),
      ).resolves.toBeUndefined();

      expect(log.error).toHaveBeenCalledWith(
        expect.stringContaining('Rollback assign-equipment failed'),
      );
    });
  });
});
