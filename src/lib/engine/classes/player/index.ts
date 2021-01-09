export class Player {
  public username: string;
  public avatar: string;
  public id: number;
  private isTurn: boolean;
  public turnCount: number;
  public coins: number;
  public season: {
    elo: number;
    wins: number;
    losses: number;
    streak: number;
    exp: number;
    maxStreak: number;
    seasonRank: string;
    seasonLevel: number;
  };
  public energyPool: Array<number>;
  private payupCart: Array<number>;
  private myChars: Array<number>;
  public myCharsRealId: Array<number>;

  constructor(player: any) {
    this.username = player.username;
    this.id = player.id;
    this.avatar = player.avatar;
    this.turnCount = 0;
    this.isTurn = false;
    this.energyPool = [0, 0, 0, 0, 0];
    this.payupCart = [0, 0, 0, 0, 0];
    this.myChars = [];
    this.coins = player.coins;
    this.season = player.season;
    this.myCharsRealId = [];
  }
  public setMyCharsIndex(myChars: Array<number>) {
    this.myChars = myChars;
  }
  public getMyCharsIndex(): Array<number> {
    return this.myChars;
  }
  public setTurn(turn: boolean) {
    this.isTurn = turn;
  }
  public getId(): number {
    return this.id;
  }
  public getPayupCart(): Array<number> {
    return this.payupCart;
  }
  public resetPayupCart() {
    this.payupCart = [0, 0, 0, 0, 0];
  }
  public removeFromPayupCart(cost: Array<number>) {
    this.payupCart = this.payupCart.map((a, i) => a - cost[i]);
  }
  public addToPayupCart(cost: Array<number>) {
    this.payupCart = this.payupCart.map((a, i) => a + cost[i]);
  }
  public increaseEnergyPool(energyIndex: number, value?: number) {
    if (!value) this.energyPool[energyIndex]++;
    else this.energyPool[energyIndex] += value;
    this.setTotalEnergyPool();
  }
  public decreaseEnergyPool(energyIndex: number, value?: number) {
    if (!value) this.energyPool[energyIndex]--;
    else this.energyPool[energyIndex] -= value;
    this.setTotalEnergyPool();
  }
  public setTotalEnergyPool() {
    this.energyPool[4] = this.energyPool
      .slice(0, 4)
      .reduce((ca, cv) => ca + cv);
  }
  public getEnergyPool(): Array<number> {
    return this.energyPool;
  }

  public returnEnergy(cost: Array<number>): void {
    const total = cost.reduce((ca, cv) => ca + cv);
    for (let i = 0; i < 4; i++) {
      this.energyPool[i] = this.energyPool[i] + cost[i];
    }
    this.energyPool[4] += total;
  }
  public consumeEnergy(cost: Array<number>): void {
    const total = cost.reduce((ca, cv) => ca + cv);
    for (let i = 0; i < 4; i++) {
      this.energyPool[i] = this.energyPool[i] - cost[i];
    }
    this.energyPool[4] -= total;
  }
}
