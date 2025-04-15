import { IsEnum, IsInt, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export enum ResultEnum {
  HIT = 'hit',
  MISS = 'miss',
}

export class ShotGameDto {

  @ApiProperty({ example: 1 })
  @IsInt()
  x: number; //position x du tir

  @ApiProperty({ example: 3 })
  @IsInt()
  y: number; //position y du tir

  @ApiProperty({ example: ResultEnum.HIT})
  @IsEnum(ResultEnum, {each: true})
  result: ResultEnum; //enum du résultat des tirs (hit ou miss)

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z'})
  @IsISO8601()
  timestamp: Date;

}
