import { PositionGameDto } from './position-game.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ShipGameDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;//id du bateau (exemple : 1-1)

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string; //nom du bateau (exemple : porte-avion)

  @ApiProperty()
  @IsString()
  @Type(() => PositionGameDto)
  position: PositionGameDto[]; //liste des dto des postions, on y mettra les positions du bateau.

  @ApiProperty()
  @IsInt()
  hits: number; //nombre de fois que le bateau est touché

  @ApiProperty()
  @IsBoolean()
  sunk: boolean; //si le bateau est touché
}