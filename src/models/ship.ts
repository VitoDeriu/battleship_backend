export class Ship {
  constructor(
    public id : string,
    public type: string,
    public positions: Array<{x: number, y: number}>,
    public hits: number,
    public sunk: boolean) {}
}

//