import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from '../prisma/prisma.module';

//c'est ici qu'on exporte le module entier pour qu'il puisse etre utilisable par l'app

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [PrismaModule]
})
export class GamesModule {}
