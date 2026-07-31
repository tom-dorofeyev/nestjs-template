import { Command } from 'sagalicious';

export interface ValidateHeroCommand extends Command {
  type: 'validate-hero';
  heroId: string;
  teamName: string;
}

export interface AssignEquipmentCommand extends Command {
  type: 'assign-equipment';
  heroId: string;
  equipmentIds: string[];
}

export interface IssueBadgeCommand extends Command {
  type: 'issue-badge';
  heroId: string;
}

export interface NotifyHQCommand extends Command {
  type: 'notify-hq';
  heroId: string;
  teamName: string;
}

export interface LogRecruitmentCommand extends Command {
  type: 'log-recruitment';
  heroId: string;
}

export type RecruitmentCommand =
  | ValidateHeroCommand
  | AssignEquipmentCommand
  | IssueBadgeCommand
  | NotifyHQCommand
  | LogRecruitmentCommand;

export interface StepResult {
  stepOrder: number;
  commandType: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  error?: string;
  timestamp: string;
}

export interface RecruitmentSagaMetadata {
  heroId: string;
  teamName: string;
  equipmentIds: string[];
  assignedEquipmentIds?: string[];
  badgeNumber: string;
  stepResults: StepResult[];
}

export interface RecruitHeroSuccess {
  transactionId: string;
  status: 'COMPLETED';
  steps: StepResult[];
  heroId: string;
  teamName: string;
  equipmentAssigned: string[];
  badgeNumber: string;
}

export interface RecruitHeroRolledBack {
  transactionId: string;
  status: 'ROLLED_BACK';
  steps: StepResult[];
  heroId: string;
  error: string;
}

export type RecruitHeroResult = RecruitHeroSuccess | RecruitHeroRolledBack;
