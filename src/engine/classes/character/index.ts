import { iCharacter } from "../../interfaces";
import {
  Types,
  BuffTypes,
  DebuffTypes,
  effectType,
  SkillClassType,
} from "../../enums";
import { Skill } from "../skill";
// IMPORTANT TO THIS CLASS ONLY
import { Arena } from "../../arena";
import { Buffs, iBuffParams } from "./buffs";
import { Notification } from "./notifications";
import { Debuffs, iDebuffParams } from "./debuffs";
import { log } from "../../../logger";

export class Character {
  public name: string;
  public literalId: number;
  private facepic: string;
  private description: string;
  public banner: string;
  private allies: Array<number>;
  private enemies: Array<number>;
  private id: number;
  private hitPoints: number;
  private isTarget: boolean;
  private knockedOut: boolean;
  private buffs: Buffs;
  private debuffs: Debuffs;
  private notifications: Array<Notification>;
  private type: Set<Types>;
  private energyGain: Array<number>;
  private belongs: { [key: number]: boolean };
  public skills: Array<Skill>;
  private arenaReference: Arena;

  constructor(data: iCharacter, playerId: number, world: Arena) {
    this.buffs = new Buffs();
    this.debuffs = new Debuffs();
    this.notifications = [];
    this.isTarget = false;
    this.banner = data.banner;
    this.name = data.name;
    this.id = Math.floor(Math.random() * (0 - 99999) + 99999);
    this.literalId = data.id;
    this.facepic = data.facepic;
    this.description = data.description;
    this.hitPoints = 100;
    this.type = new Set(data.type);
    this.energyGain = data.energyGain;
    this.belongs = {};
    this.belongs[playerId] = true;
    this.skills = [];
    this.allies = [];
    this.enemies = [];
    this.knockedOut = false;
    this.arenaReference = world;
    for (const skill of data.skills) {
      this.skills.push(new Skill(skill, this.id, this.arenaReference));
    }
  }

  public setAllies(allies: Array<number>) {
    this.allies = allies;
  }

  public getAllies(): Array<number> {
    return this.allies;
  }

  public getEnemies(): Array<number> {
    return this.enemies;
  }

  public setEnemies(enemies: Array<number>) {
    this.enemies = enemies;
  }

  public geHitPoints(): number {
    return this.hitPoints;
  }

  public setHitPoints(hp: number): void {
    if (!hp && hp !== 0) {
      log.info("problem setting health");
      return;
    }

    this.hitPoints = hp;
    if (this.hitPoints <= 0) {
      this.hitPoints = 0;
      this.knockOut();
    } else if (this.hitPoints > 100) this.hitPoints = 100;
  }

  public belongsTo(id: number): boolean {
    return this.belongs[id];
  }

  public lowerCooldowns(char: Character) {
    for (const skill of this.skills) {
      skill.lowerCooldown(0);
    }
  }

  public generateEnergy(): number {
    let index = this.energyGain[
      Math.floor(Math.random() * this.energyGain.length)
    ];
    if (index === 4) {
      index = Math.floor(Math.random() * 3);
    }
    return index;
  }

  public getEnergyGain(): Array<number> {
    return this.energyGain;
  }

  public getOwner(): number {
    return Number(Object.keys(this.belongs)[0]);
  }

  public validadeSkillsCompletely(
    pool: Array<number>,
    chars: Array<Character>,
    playerId: number,
    self?: number
  ) {
    for (const skill of this.skills) {
      if (this.isStunned() || this.isStunned(skill)) {
        skill.disable();
      } else {
        skill.enable();
        skill.validateCoolDown();
        skill.validateCost(pool);
        skill.setTargetChoices(chars, playerId, self);
      }
    }
  }

  public validateSkillsCost(pool: Array<number>) {
    for (const skill of this.skills) {
      if (this.isStunned() || this.isStunned(skill)) {
        skill.disable();
      } else {
        skill.enable();
        skill.validateCoolDown();
        skill.validateCost(pool);
      }
    }
  }

  public getCopySkillByIndex(index: number): Skill {
    log.info(`Skill selected: ${this.skills[index].name}`);
    const newObj = JSON.parse(JSON.stringify(this.skills[index].getCopyData()));
    return new Skill(newObj, this.id, this.arenaReference);
  }

  public getRealSkillByIndex(index: number): Skill {
    return this.skills[index];
  }

  public getRealSkillById(id: number): Skill {
    for (const skill of this.skills) {
      if (skill.getId() === id) return skill;
    }
    return null;
  }

  public setSkillCooldownByIndex(index: number) {
    const cdr1 = this.buffs.cooldownReduction.ofAllSkills || 0;
    const cdr2 =
      this.buffs.cooldownReduction.ofSkillId[this.skills[index].getId()] || 0;

    const n = this.debuffs.getCooldownIncreasal() - (cdr1 + cdr2);
    this.skills[index].startCooldown(n);
  }

  public enableSkills() {
    this.skills.forEach((s) => {
      s.disabled = false;
    });
  }

  public knockOut() {
    this.knockedOut = true;
    this.disableSkills();
    const myIndex = this.arenaReference.findCharacterById(this.id).index;

    for (const activeSkill of this.arenaReference.getActiveSkills()) {
      let i = activeSkill.getTargets().indexOf(myIndex);
      if (i !== -1) activeSkill.getTargets().splice(i, 1);

      for (const activeEffects of activeSkill.effects) {
        i = activeEffects.getTargets().indexOf(myIndex);
        if (i !== -1) activeEffects.getTargets().splice(i, 1);
      }
    }
  }

  public isKnockedOut(): boolean {
    return this.knockedOut;
  }

  public disableSkills() {
    this.skills.forEach((s) => {
      s.disable();
    });
  }

  public setBuff(params: any) {
    const { buffType } = params;
    switch (buffType) {
      case BuffTypes.DecreaseDamageTaken:
        {
          this.buffs.setDecreaseDamageTaken(params);
        }
        break;
      case BuffTypes.AbsorbDamage:
        {
          this.buffs.setAbsorbDamage(params);
        }
        break;
    }
  }

  public setDebuff(params: iDebuffParams) {
    switch (params.debuffType) {
      case DebuffTypes.CooldownIncreasal:
        {
          this.debuffs.setCooldownIncreasal(params);
        }
        break;
    }
  }

  public isInvulnerable(skill: Skill): boolean {
    return this.buffs.isInvulnerable(skill);
  }

  public clearBuffs() {
    this.buffs.clearInvulnerability();
    this.buffs.clearCooldownReduction();
    this.buffs.clearDecreaseDamageTaken();
    this.buffs.clearAbsorbDamage();
    this.buffs.clearDamageIncreasal();
    this.buffs.validateDD();
  }

  public clearEnemyPhaseBuffs() {
    this.buffs.clearInvulnerability();
  }

  public clearPlayerPhaseBuffs() {
    this.buffs.clearCooldownReduction();
  }

  public getBuffs(): Buffs {
    return this.buffs;
  }

  public getDebuffs(): Debuffs {
    return this.debuffs;
  }

  public clearDebuffs() {
    this.debuffs.clearDebuffs();
  }

  public getId(): number {
    return this.id;
  }

  public getTyping(): Set<Types> {
    return this.type;
  }

  public isStunned(skill?: Skill): boolean {
    if (skill) return this.debuffs.isStunned(skill.class);
    return this.debuffs.isStunned(SkillClassType.Any);
  }

  public getSkills(): Array<Skill> {
    return this.skills;
  }

  public clearSkillMods() {
    for (const skill of this.skills) {
      skill.clearMods();
    }
  }

  public addNotification(data: {
    msg: string;
    id: number;
    skillpic: string;
    skillName: string;
  }) {
    this.notifications.push(new Notification(data));
  }

  public clearNotifications() {
    this.notifications = [];
  }

  public findSkillById(id: number) {
    for (const skill of this.skills) {
      if (skill.getId() === id) return skill;
    }
  }

  public getPublicData() {
    const publicData = {
      ...this,
    };

    delete publicData.arenaReference;
    delete publicData.literalId;
    delete publicData.enemies;
    delete publicData.allies;
    delete publicData.skills;
    delete publicData.buffs;
    delete publicData.debuffs;
    
    const skillCopy = [];
    for (const skill of this.skills) {
      skillCopy.push(skill.getPublicData());
    }

    return {
      ...publicData,
      skills: skillCopy,
    };
  }
}
