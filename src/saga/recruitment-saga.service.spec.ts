import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from 'src/common/log/log.service';
import { MongooseTransactionRepository } from 'src/saga-transaction/mongoose-transaction.repository';
import { ValidateHeroHandler } from './handlers/validate-hero.handler';
import { AssignEquipmentHandler } from './handlers/assign-equipment.handler';
import { IssueBadgeHandler } from './handlers/issue-badge.handler';
import { NotifyHQHandler } from './handlers/notify-hq.handler';
import { LogRecruitmentHandler } from './handlers/log-recruitment.handler';
import { RecruitmentSagaService } from './recruitment-saga.service';
import {
  RecruitmentSagaMetadata,
  RecruitHeroSuccess,
  RecruitHeroRolledBack,
} from './recruitment-saga.types';

jest.mock('sagalicious', () => {
  const mockSaga = {
    execute: jest.fn(),
  };

  const builder = {
    handler: jest.fn().mockReturnThis(),
    withRepository: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue(mockSaga),
  };

  return {
    createSaga: jest.fn().mockReturnValue(builder),
    TransactionStatus: {
      CREATED: 'CREATED',
      RUNNING: 'RUNNING',
      COMPLETED: 'COMPLETED',
      FAILED: 'FAILED',
    },
  };
});

describe('RecruitmentSagaService', () => {
  let service: RecruitmentSagaService;
  let sagaExecute: jest.Mock;

  const mockHandler = () => ({
    execute: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    const { createSaga } = jest.requireMock('sagalicious');
    const builder = createSaga();
    sagaExecute = builder.build().execute;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruitmentSagaService,
        { provide: ValidateHeroHandler, useValue: mockHandler() },
        { provide: AssignEquipmentHandler, useValue: mockHandler() },
        { provide: IssueBadgeHandler, useValue: mockHandler() },
        { provide: NotifyHQHandler, useValue: mockHandler() },
        { provide: LogRecruitmentHandler, useValue: mockHandler() },
        {
          provide: MongooseTransactionRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteById: jest.fn(),
            findByStatus: jest.fn(),
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

    service = module.get(RecruitmentSagaService);
  });

  describe('recruit', () => {
    const heroId = 'hero-1';
    const teamName = 'Avengers';
    const equipmentIds = ['eq-1', 'eq-2'];

    it('returns COMPLETED result when all steps succeed', async () => {
      sagaExecute.mockImplementation(
        async (_commands: unknown, tx: { metadata: any }) => {
          const meta = tx.metadata as RecruitmentSagaMetadata;
          meta.stepResults.push({
            stepOrder: 1,
            commandType: 'validate-hero',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:00.000Z',
          });
          meta.stepResults.push({
            stepOrder: 2,
            commandType: 'assign-equipment',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:01.000Z',
          });
          meta.stepResults.push({
            stepOrder: 3,
            commandType: 'issue-badge',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:02.000Z',
          });
          meta.stepResults.push({
            stepOrder: 4,
            commandType: 'notify-hq',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:03.000Z',
          });
          meta.stepResults.push({
            stepOrder: 5,
            commandType: 'log-recruitment',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:04.000Z',
          });
          meta.assignedEquipmentIds = ['eq-1', 'eq-2'];
          meta.badgeNumber = 'BADGE-001';
        },
      );

      const result = (await service.recruit(
        heroId,
        teamName,
        equipmentIds,
      )) as RecruitHeroSuccess;

      expect(result.status).toBe('COMPLETED');
      expect(result.heroId).toBe('hero-1');
      expect(result.teamName).toBe('Avengers');
      expect(result.badgeNumber).toBe('BADGE-001');
      expect(result.equipmentAssigned).toEqual(['eq-1', 'eq-2']);
      expect(result.steps).toHaveLength(5);
    });

    it('falls back to uniqueEquipmentIds when assignedEquipmentIds is not set in metadata', async () => {
      sagaExecute.mockImplementation(
        async (_commands: unknown, tx: { metadata: any }) => {
          const meta = tx.metadata as RecruitmentSagaMetadata;
          meta.stepResults.push({
            stepOrder: 1,
            commandType: 'validate-hero',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:00.000Z',
          });
          meta.stepResults.push({
            stepOrder: 2,
            commandType: 'assign-equipment',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:01.000Z',
          });
          meta.stepResults.push({
            stepOrder: 3,
            commandType: 'issue-badge',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:02.000Z',
          });
          meta.stepResults.push({
            stepOrder: 4,
            commandType: 'notify-hq',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:03.000Z',
          });
          meta.stepResults.push({
            stepOrder: 5,
            commandType: 'log-recruitment',
            status: 'SUCCESS',
            timestamp: '2025-01-01T00:00:04.000Z',
          });
          meta.badgeNumber = 'BADGE-001';
        },
      );

      const result = (await service.recruit(heroId, teamName, [
        'eq-1',
        'eq-2',
        'eq-1',
      ])) as RecruitHeroSuccess;

      expect(result.status).toBe('COMPLETED');
      expect(result.equipmentAssigned).toEqual(['eq-1', 'eq-2']);
    });

    it('returns ROLLED_BACK result when a step fails with proper step tracking', async () => {
      const stepError = new Error('Equipment eq-2 is not available');
      sagaExecute.mockRejectedValue(stepError);

      const result = (await service.recruit(
        heroId,
        teamName,
        equipmentIds,
      )) as RecruitHeroRolledBack;

      expect(result.status).toBe('ROLLED_BACK');
      expect(result.heroId).toBe('hero-1');
      expect(result.error).toContain('Equipment eq-2 is not available');
      expect(result.steps).toHaveLength(5);
      expect(result.steps[0].status).toBe('FAILED');
      expect(result.steps[0].commandType).toBe('validate-hero');
      expect(result.steps[0].stepOrder).toBe(1);
      expect(result.steps.slice(1).every((s) => s.status === 'SKIPPED')).toBe(
        true,
      );
    });

    it('returns ROLLED_BACK with non-Error rejection', async () => {
      sagaExecute.mockRejectedValue('Something went wrong');

      const result = (await service.recruit(
        heroId,
        teamName,
        equipmentIds,
      )) as RecruitHeroRolledBack;

      expect(result.status).toBe('ROLLED_BACK');
      expect(result.error).toBe('Something went wrong');
    });
  });
});
