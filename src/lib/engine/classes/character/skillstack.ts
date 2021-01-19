import { log } from "../../../logger";

export class SkillStack {
  skills: { [x: string]: boolean };
  constructor() {
    this.skills = {};
  }
  add(id: number) {
    this.skills[id] = true;
  }
  remove(id: number) {
    delete this.skills[id];
  }
  clearStack() {
    this.skills = {};
  }
  isTargetOf(ids: Array<number>) {
    for (const id of ids) {
      if (this.skills[id]) return true;
    }
    return false;
  }
}
