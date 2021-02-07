import { log } from "../../../logger";

export class SkillStack {
  skills: { [x: string]: boolean };
  constructor() {
    this.skills = {};
  }
  add(id: number, caster: number) {
    this.skills[`${id}-${caster}`] = true;
  }
  remove(id: number, caster: number) {
    log.info(`clear skill stack ${id}-${caster}`, this.skills);
    delete this.skills[`${id}-${caster}`];
  }
  clearStack() {
    this.skills = {};
  }
  isTargetOf(ids: Array<string>) {
    for (const id of ids) {
      if (this.skills[id]) return true;
    }
    return false;
  }
}
