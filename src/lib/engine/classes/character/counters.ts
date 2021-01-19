import { log } from "../../../logger";

export class CounterStack {
  counter: { [x: string]: number };
  constructor() {
    this.counter = {};
  }
  add(id: number) {
    this.counter[id] = (this.counter[id] || 0) + 1;
  }
  clearStack() {
    this.counter = {};
  }
  decrease(id: number) {
    if (!this.counter[id]) return;
    this.counter[id] = Math.max(this.counter[id] - 1, 0);
  }
  count(id: number) {
    return this.counter[id] || 0;
  }
}
