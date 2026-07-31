import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StepResultDto {
  @ApiProperty()
  stepOrder: number;

  @ApiProperty()
  commandType: string;

  @ApiProperty({ enum: ['SUCCESS', 'FAILED', 'SKIPPED'] })
  status: string;

  @ApiPropertyOptional()
  error?: string;

  @ApiProperty()
  timestamp: string;
}

interface SuccessInput {
  transactionId: string;
  status: 'COMPLETED';
  steps: StepResultDto[];
  heroId: string;
  teamName: string;
  equipmentAssigned: string[];
  badgeNumber: string;
}

interface RolledBackInput {
  transactionId: string;
  status: 'ROLLED_BACK';
  steps: StepResultDto[];
  heroId: string;
  error: string;
}

export class RecruitHeroResponseDto {
  @ApiProperty()
  transactionId: string;

  @ApiProperty({ enum: ['COMPLETED', 'ROLLED_BACK'] })
  status: string;

  @ApiProperty({ type: [StepResultDto] })
  steps: StepResultDto[];

  @ApiProperty()
  heroId: string;

  @ApiPropertyOptional()
  teamName?: string;

  @ApiPropertyOptional({ type: [String] })
  equipmentAssigned?: string[];

  @ApiPropertyOptional()
  badgeNumber?: string;

  @ApiPropertyOptional()
  error?: string;

  static fromSuccess(result: SuccessInput): RecruitHeroResponseDto {
    return {
      transactionId: result.transactionId,
      status: result.status,
      steps: result.steps,
      heroId: result.heroId,
      teamName: result.teamName,
      equipmentAssigned: result.equipmentAssigned,
      badgeNumber: result.badgeNumber,
    };
  }

  static fromRolledBack(result: RolledBackInput): RecruitHeroResponseDto {
    return {
      transactionId: result.transactionId,
      status: result.status,
      steps: result.steps,
      heroId: result.heroId,
      error: result.error,
    };
  }
}
