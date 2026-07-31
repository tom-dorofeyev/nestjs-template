import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IEquipment {
  id: string;
  name: string;
  type: string;
  status: string;
  assignedTo?: string | null;
}

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema()
export class Equipment {
  @Prop({ default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, enum: ['weapon', 'armor', 'gadget', 'vehicle'] })
  type: string;

  @Prop({
    required: true,
    enum: ['AVAILABLE', 'ASSIGNED'],
    default: 'AVAILABLE',
  })
  status: string;

  @Prop({ type: String, default: null })
  assignedTo?: string | null;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
