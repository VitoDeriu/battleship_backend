import { Ship } from "./ship";

export class Player {
  constructor(
    public id: string,
    public ships : Ship[],
  ){}
}