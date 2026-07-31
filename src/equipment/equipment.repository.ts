import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/base.repository';
import { Equipment } from './schemas/equipment.schema';

@Injectable()
export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor(@InjectModel(Equipment.name) model: Model<Equipment>) {
    super(model);
  }

  async findByIds(ids: string[]): Promise<Equipment[]> {
    return this.model
      .find({ id: { $in: ids } })
      .lean()
      .exec();
  }

  async assignToHero(
    equipmentId: string,
    heroId: string,
  ): Promise<Equipment | null> {
    return this.model
      .findOneAndUpdate(
        { id: equipmentId, status: 'AVAILABLE' },
        { status: 'ASSIGNED', assignedTo: heroId },
        { new: true },
      )
      .exec();
  }

  async releaseFromHero(equipmentId: string): Promise<Equipment | null> {
    return this.model
      .findOneAndUpdate(
        { id: equipmentId },
        { status: 'AVAILABLE', assignedTo: null },
        { new: true },
      )
      .exec();
  }

  async countAvailable(): Promise<number> {
    return this.model.countDocuments({ status: 'AVAILABLE' }).exec();
  }
}
