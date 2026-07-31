import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface ISuperhero {
  id: string;
  name: string;
  alias: string;
  powers: string[];
  weaknesses?: string[];
  recruitmentStatus: string;
  teamName?: string | null;
}

export type SuperheroDocument = HydratedDocument<Superhero>;

@Schema()
export class Superhero implements ISuperhero {
  @Prop({ default: uuidv4, unique: true })
  id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  alias: string;

  @Prop({ required: true, type: [String] })
  powers: string[];

  @Prop({ required: false, type: [String] })
  weaknesses?: string[];

  @Prop({
    required: true,
    enum: ['AVAILABLE', 'RECRUITED'],
    default: 'AVAILABLE',
  })
  recruitmentStatus: string;

  @Prop({ type: String, default: null })
  teamName?: string | null;
}

export const SuperheroSchema = SchemaFactory.createForClass(Superhero);
