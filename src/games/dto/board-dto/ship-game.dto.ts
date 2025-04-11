import { PositionGameDto } from './position-game.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShipGameDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;//id du bateau (exemple : 1-1)

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string; //nom du bateau (exemple : porte-avion)

  position: PositionGameDto[]; //liste des dto des postions, on y mettra les positions du bateau.

  hits: number; //nombre de fois que le bateau est touché

  sunk: boolean; //si le bateau est touché
}