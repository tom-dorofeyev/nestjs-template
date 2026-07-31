import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IBadge {
  id: string;
  badgeNumber: string;
  heroId: string;
  issuedAt: Date;
}

export type BadgeDocument = HydratedDocument<Badge>;

@Schema()
export class Badge {
  @Prop({ default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  badgeNumber: string;

  @Prop({ required: true })
  heroId: string;

  @Prop({ default: Date.now })
  issuedAt: Date;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
