import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SagaTransactionDocument = HydratedDocument<SagaTransaction>;

@Schema({ timestamps: true })
export class SagaTransaction {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, enum: ['PENDING', 'COMPLETED', 'ROLLED_BACK'] })
  status: string;

  @Prop({ type: [{ type: Object }], default: [] })
  commands: Record<string, any>[];

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;
}

export const SagaTransactionSchema =
  SchemaFactory.createForClass(SagaTransaction);
