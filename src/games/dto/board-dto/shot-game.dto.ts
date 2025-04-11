

export enum ResultEnum {
  HIT = 'hit',
  MISS = 'miss',
}

export class ShotGameDto {

  x: number; //position x du tir
  y: number; //position y du tir
  result: ResultEnum; //enum du résultat des tirs (hit ou miss)
  timestamp: Date;

}
