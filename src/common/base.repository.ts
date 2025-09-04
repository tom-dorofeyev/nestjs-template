import { Model, FilterQuery } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return (await entity.save()).toObject() as T;
  }

  async update(filter: FilterQuery<T>, update: Partial<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true }).exec();
  }

  async delete(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount > 0;
  }
}
