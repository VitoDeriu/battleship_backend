import { ShipGameDto } from './ship-game.dto';
import { ShotGameDto } from './shot-game.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

//DTO de détail des joueurs de la partie
export class PlayerGameDto {

  @ApiProperty({ example: 'UUID-Player1'})
  @IsString()
  @IsNotEmpty()
  id: string; //id du joueur qu'on récupère dans le front

  @ApiProperty({ type: [ShipGameDto]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipGameDto)
  @IsNotEmpty()
  ships: ShipGameDto[]; //liste de DTO des ships du joueur

  @ApiProperty({ type: [ShotGameDto]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShotGameDto)
  @IsNotEmpty()
  shots: ShotGameDto[]; //liste de DTO des shots du joueur

}