import { Transaction } from 'sagalicious';

export interface ISagaStepHandler {
  execute(command: any, transaction: Transaction): Promise<void>;
  rollback(command: any, transaction: Transaction): Promise<void>;
}
