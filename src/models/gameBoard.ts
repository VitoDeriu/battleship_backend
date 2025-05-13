import { Player } from "./player";

export class GameBoard {
  constructor(
    public players: { player1: Player, player2: Player },
    public currentTurn: number,
    public actions: Array<{
      turn: number,
      player: string,
      action: string,
      coordinates: {x: number, y: number},
      result: string
    }>,
    public status: string,
    public startedAt: Date | null,
    public finishedAt: Date | null
  ) {}
}