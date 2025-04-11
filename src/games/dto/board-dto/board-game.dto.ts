import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerGameDto } from './player-game.dto';
import { TurnGameDto } from './turn-game.dto';
import { Type } from 'class-transformer';

//DTO d'enum des status de parties
export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',

}

//DTO représentant le format complet du JSON BoardGame
export class BoardGameDto {

  @ApiProperty({ type: 'object', additionalProperties: { type: "PlayerGameDto" } }) //jpense y'a eu un pb ici avec le type de additional properties
  @IsObject() //oblige le champs a etre un objet
  @ValidateNested({ each: true }) //permet la validation récursive des object PlayerGameDto
  @Type(() => PlayerGameDto)
  players: Record<string, PlayerGameDto>; // liste de playerDTO des deux joueurs

  @ApiProperty()
  @IsString()
  currentTurn: string; //nom du joueur dont c'est le tour

  @ApiProperty({ type: [TurnGameDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TurnGameDto)
  turns: TurnGameDto[]; //liste de actionDTO des tours de jeu

  @ApiProperty({ enum: GameStatus, example: GameStatus.IN_PROGRESS })
  @IsEnum(GameStatus)
  @IsNotEmpty()
  status: GameStatus;// DTO d'enum des status de la partie

  @ApiProperty({ example: '2023-03-22T09:55:00Z' })
  @IsISO8601()
  startedAt: Date; //timestamp de lancement de partie

  @ApiProperty({ example: '2023-03-22T12:10:00Z', nullable: true })
  @IsOptional()
  @IsISO8601()
  finishedAt?: Date|null; //timestamp de fin de partie

}