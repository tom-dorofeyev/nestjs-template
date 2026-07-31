import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from './schemas/equipment.schema';
import { EquipmentRepository } from './equipment.repository';
import { EquipmentSeeder } from './equipment.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  providers: [EquipmentRepository, EquipmentSeeder],
  exports: [EquipmentRepository],
})
export class EquipmentModule {}
