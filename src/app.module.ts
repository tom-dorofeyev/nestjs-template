import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperheroModule } from './superheroes/superhero.module';
import { HttpModule } from './common/http/http.module';
import { LogModule } from './common/log/log.module';
import { LogMiddleware } from './common/log/log.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    SuperheroModule,
    HttpModule,
    LogModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
