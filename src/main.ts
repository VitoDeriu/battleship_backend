import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  //création du module d'app avec NestFactory
  const app = await NestFactory.create(AppModule);

  //did a l'app d'utiliser ValidationPipe comme GlobalPipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  //dis a l'app d'utiliser ClassSerializerInterceptor comme GlobalInterceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  //config de swagger
  const config = new DocumentBuilder()
    .setTitle('Battleship API')
    .setDescription('The Battleship API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  //setup de swagger avec la config
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //dis à l'app d'utiliser les filtres d'exception de prisma
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  //lance le serveur sur le port 3000
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
