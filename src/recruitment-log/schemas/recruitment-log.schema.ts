import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class StepResult {
  @Prop({ required: true })
  stepOrder: number;

  @Prop({ required: true })
  commandType: string;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILED', 'SKIPPED'] })
  status: string;

  @Prop({ type: String, required: false })
  error?: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

const StepResultSchema = SchemaFactory.createForClass(StepResult);

export interface IStepResult {
  stepOrder: number;
  commandType: string;
  status: string;
  error?: string;
  timestamp: Date;
}

export interface IRecruitmentLog {
  id: string;
  heroId: string;
  status: string;
  steps: IStepResult[];
  createdAt: Date;
}

export type RecruitmentLogDocument = HydratedDocument<RecruitmentLog>;

@Schema({ timestamps: true })
export class RecruitmentLog {
  @Prop({ default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true })
  heroId: string;

  @Prop({ required: true, enum: ['PENDING', 'COMPLETED', 'ROLLED_BACK'] })
  status: string;

  @Prop({ type: [StepResultSchema], default: [] })
  steps: StepResult[];
}

export const RecruitmentLogSchema =
  SchemaFactory.createForClass(RecruitmentLog);
