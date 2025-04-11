import { JsonValue } from '@prisma/client/runtime/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { BoardGameDto } from './board-dto/board-game.dto';

//c'est ici qu'on va donner les règles des champs pour la création de parties

export class CreateGameDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_player1: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_player2: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  winnerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsString()
  @ApiProperty()
  winCondition: string | null;

  @IsJSON()
  @IsString()
  @ApiProperty()
  boardGame: BoardGameDto;

}
