import { log } from "../../../logger";

export class EffectStack {
  stack: { [x: string]: number };
  constructor() {
    this.stack = {};
  }
  add(id: number) {
    this.stack[id] = (this.stack[id] || 0) + 1;
  }
  clearStack() {
    this.stack = {};
  }
  decrease(id:number) {
    this.stack[id]--
  }
  count(id: number) {
    return this.stack[id] || 0;
  }
}
