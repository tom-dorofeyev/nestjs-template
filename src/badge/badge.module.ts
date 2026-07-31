import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from './schemas/badge.schema';
import { BadgeRepository } from './badge.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  providers: [BadgeRepository],
  exports: [BadgeRepository],
})
export class BadgeModule {}
