import { Games } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/client';

//c'est ici qu'on va créer les champs de schemas de swagger

export class GameEntity implements Games {
  constructor(partial: Partial<GameEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  id_player1: string;

  @ApiProperty()
  id_player2: string;

  @ApiProperty()
  winnerId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  winCondition: string | null;

  @ApiProperty()
  boardGame: JsonValue;
}
