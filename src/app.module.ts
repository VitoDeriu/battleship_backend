import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';


import { SocketModule } from './socket/socket.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, GamesModule, SocketModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}