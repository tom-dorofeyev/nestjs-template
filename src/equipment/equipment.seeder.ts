import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './schemas/equipment.schema';

@Injectable()
export class EquipmentSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Equipment.name) private readonly model: Model<Equipment>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.model.countDocuments().exec();
    if (count !== 0) return;

    const seedItems = [
      { name: 'Mjolnir', type: 'weapon' },
      { name: 'Vibranium Shield', type: 'armor' },
      { name: 'Web Shooters', type: 'gadget' },
      { name: 'Quinjet', type: 'vehicle' },
      { name: 'Arc Reactor', type: 'armor' },
      { name: 'Stormbreaker', type: 'weapon' },
      { name: 'Batmobile', type: 'vehicle' },
      { name: 'Batarangs', type: 'gadget' },
    ];

    const entities = seedItems.map((item) => new this.model(item));
    await Promise.all(entities.map((e) => e.save()));
  }
}
