import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SagaTransaction,
  SagaTransactionSchema,
} from './schemas/saga-transaction.schema';
import { MongooseTransactionRepository } from './mongoose-transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SagaTransaction.name, schema: SagaTransactionSchema },
    ]),
  ],
  providers: [MongooseTransactionRepository],
  exports: [MongooseTransactionRepository],
})
export class SagaTransactionModule {}
