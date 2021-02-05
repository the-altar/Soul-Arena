"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(player) {
        this.clientId;
        this.locked = false;
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
    setMyCharsIndex(myChars) {
        this.myChars = myChars;
    }
    getMyCharsIndex() {
        return this.myChars;
    }
    setTurn(turn) {
        this.isTurn = turn;
    }
    getId() {
        return this.id;
    }
    getPayupCart() {
        return this.payupCart;
    }
    resetPayupCart() {
        this.payupCart = [0, 0, 0, 0, 0];
    }
    removeFromPayupCart(cost) {
        this.payupCart = this.payupCart.map((a, i) => a - cost[i]);
    }
    addToPayupCart(cost) {
        this.payupCart = this.payupCart.map((a, i) => a + cost[i]);
    }
    increaseEnergyPool(energyIndex, value) {
        if (!value)
            this.energyPool[energyIndex]++;
        else
            this.energyPool[energyIndex] += value;
        this.setTotalEnergyPool();
    }
    decreaseEnergyPool(energyIndex, value) {
        if (!value)
            this.energyPool[energyIndex]--;
        else
            this.energyPool[energyIndex] -= value;
        this.setTotalEnergyPool();
    }
    setTotalEnergyPool() {
        this.energyPool[4] = this.energyPool
            .slice(0, 4)
            .reduce((ca, cv) => ca + cv);
    }
    getEnergyPool() {
        return this.energyPool;
    }
    returnEnergy(cost) {
        const total = cost.reduce((ca, cv) => ca + cv);
        for (let i = 0; i < 4; i++) {
            this.energyPool[i] = this.energyPool[i] + cost[i];
        }
        this.energyPool[4] += total;
    }
    consumeEnergy(cost) {
        const total = cost.reduce((ca, cv) => ca + cv);
        for (let i = 0; i < 4; i++) {
            this.energyPool[i] = this.energyPool[i] - cost[i];
        }
        this.energyPool[4] -= total;
    }
}
exports.Player = Player;
//# sourceMappingURL=index.js.map