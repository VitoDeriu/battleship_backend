import { PositionGameDto } from './position-game.dto';
import { ResultEnum } from './shot-game.dto';

export class TurnGameDto {

  turn: number; //id du tour en autoincrementation
  player: string; //nom du joueur ou son id a voir mais plus simple d'y stocker son nom depuis la logique de jeu
  coordinates: PositionGameDto[];
  result: ResultEnum;

}