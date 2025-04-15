import { PositionGameDto } from './position-game.dto';
import { ResultEnum } from './shot-game.dto';
import { IsEnum, IsInt, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TurnGameDto {

  @ApiProperty()
  @IsInt()
  turn: number; //id du tour en autoincrementation

  @ApiProperty()
  @IsString()
  player: string; //nom du joueur ou son id à voir mais plus simple d'y stocker son nom depuis la logique de jeu

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PositionGameDto)
  coordinates: PositionGameDto[];

  @ApiProperty()
  @IsEnum(ResultEnum)
  result: ResultEnum;

}