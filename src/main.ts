import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Superheroes')
    .setDescription('API for managing superheroes')
    .setVersion('1.0')
    .addTag('superheroes')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, documentFactory, {
    useGlobalPrefix: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
