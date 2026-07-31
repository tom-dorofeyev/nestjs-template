import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionStatus,
  TransactionRepository,
} from 'sagalicious';
import { SagaTransaction } from './schemas/saga-transaction.schema';

@Injectable()
export class MongooseTransactionRepository implements TransactionRepository {
  constructor(
    @InjectModel(SagaTransaction.name)
    private readonly model: Model<SagaTransaction>,
  ) {}

  async create(transaction: Transaction): Promise<void> {
    const doc = new this.model({
      ...transaction,
      _id: undefined,
    });
    await doc.save();
  }

  async findByIdAndUpdate(
    id: string,
    updates: Partial<Transaction>,
  ): Promise<void> {
    await this.model.findOneAndUpdate({ id }, updates).exec();
  }

  async findById(id: string): Promise<Transaction | null> {
    const doc = await this.model.findOne({ id }).exec();
    if (!doc) return null;
    const plain = doc.toObject();
    delete (plain as any)._id;
    delete (plain as any).__v;
    return plain as unknown as Transaction;
  }

  async deleteById(id: string): Promise<void> {
    await this.model.deleteOne({ id }).exec();
  }

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    const docs = await this.model.find({ status }).exec();
    return docs.map((doc) => {
      const plain = doc.toObject();
      delete (plain as any)._id;
      delete (plain as any).__v;
      return plain as unknown as Transaction;
    });
  }
}
