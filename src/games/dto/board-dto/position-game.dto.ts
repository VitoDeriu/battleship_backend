import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PositionGameDto {

  //faire des règles de limites de board

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Max(10)
  x: number; //position X de tir ou de bateau

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Max(10)
  y: number; //position Y de tir ou de bateau

}