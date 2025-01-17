import { iCharacter } from "../../interfaces";
import {
  BuffTypes,
  DebuffTypes,
  effectType,
  SkillClassType,
  CharacterTypes,
} from "../../enums";
import { Skill } from "../skill";
// IMPORTANT TO THIS CLASS ONLY
import { Arena } from "../../arena";
import { Buffs, iBuffParams } from "./buffs";
import { Notification } from "./notifications";
import { Debuffs, iDebuffParams } from "./debuffs";
import { EffectStack } from "./effetStack";
import { CounterStack } from "./counters";
import { SkillStack } from "./skillstack";
import { log } from "../../../logger";
import { Effect } from "../effect";

export class Character {
  public name: string;
  /** This ID is unique to the game instance */
  private id: number;
  /** The actual ID of the character on the database*/
  public literalId: number;
  private facepic: string;
  private description: string;
  public banner: string;
  private allies: Array<number>;
  private enemies: Array<number>;
  public skillStack: SkillStack;
  public counterStack: CounterStack;
  private hitPoints: number;
  private isTarget: boolean;
  private knockedOut: boolean;
  public buffs: Buffs;
  private debuffs: Debuffs;
  private notifications: Array<Notification>;
  private type: Set<CharacterTypes>;
  private energyGain: Array<number>;
  private belongs: { [key: number]: boolean };
  public skills: Array<Skill>;
  private arenaReference: Arena;
  public effectStack: EffectStack;
  public dexNumber: number;
  public myIndex: number;

  constructor(data: iCharacter, playerId: number, world: Arena, index: number) {
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
    this.dexNumber = data.dexNumber;
    this.energyGain = data.energyGain;
    this.belongs = {};
    this.belongs[playerId] = true;
    this.skills = [];
    this.allies = [];
    this.enemies = [];
    this.knockedOut = false;
    this.arenaReference = world;
    this.effectStack = new EffectStack();
    this.counterStack = new CounterStack();
    this.skillStack = new SkillStack();
    this.myIndex = index;

    for (const skill of data.skills) {
      this.skills.push(new Skill(skill, this.id, this.arenaReference, this));
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
      log.info(`[GAME] problem setting health ${hp}`);
      return;
    }

    this.hitPoints = hp;
    if (this.hitPoints <= 0) {
      if (this.buffs.cannotBeKilled) {
        this.hitPoints = 5;
        return;
      }
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
      skill.clearMods();
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
      //log.info(`[SKILL - ${this.name}] ${skill.name}`, this.skillStack);
      skill.setTurnCost();
      if (this.isStunned(skill)) {
        skill.disable();
      } else if (
        skill.cannotBeUsedOnTargetOf.length &&
        this.skillStack.isTargetOf(skill.cannotBeUsedOnTargetOf)
      ) {
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
      if (this.isStunned(skill)) {
        skill.disable();
      } else if (
        skill.cannotBeUsedOnTargetOf.length &&
        this.skillStack.isTargetOf(skill.cannotBeUsedOnTargetOf)
      ) {
        skill.disable;
      } else {
        skill.enable();
        skill.validateCoolDown();
        skill.validateCost(pool);
      }
    }
  }

  public getCopySkillByIndex(index: number): Skill {
    const newObj = JSON.parse(JSON.stringify(this.skillByIndex(index).getCopyData()));
    return new Skill(newObj, this.id, this.arenaReference, this);
  }

  public getRealSkillByIndex(index: number): Skill {
    return this.skillByIndex(index);
  }

  public getRealSkillById(id: number): Skill {
    for (const skill of this.skills) {
      if (skill.getId() == id) return skill;
    }
    return null;
  }

  public setSkillCooldownByIndex(index: number) {
    const cdr1 = this.buffs.cooldownReduction.ofAllSkills || 0;
    const cdr2 =
      this.buffs.cooldownReduction.ofSkillId[this.skillByIndex(index).getId()] || 0;

    const n = this.debuffs.getCooldownIncreasal() - (cdr1 + cdr2);
    this.skillByIndex(index).startCooldown(n);
  }

  public enableSkills() {
    this.skills.forEach((s) => {
      s.disabled = false;
    });
  }

  public knockOut() {
    this.knockedOut = true;
    this.disableSkills();
    /*const myIndex = this.arenaReference.findCharacterById(this.id).index;

    for (const activeSkill of this.arenaReference.getActiveSkills()) {
      let i = activeSkill.getTargets().indexOf(myIndex);
      if (i !== -1) activeSkill.getTargets().splice(i, 1);

      for (const activeEffects of activeSkill.effects) {
        i = activeEffects.getTargets().indexOf(myIndex);
        if (i !== -1) activeEffects.getTargets().splice(i, 1);
      }
    }*/
  }

  public isKnockedOut(): boolean {
    return this.knockedOut;
  }

  public addEffectStack(effect: Effect) {
    this.effectStack.add(effect.gameId);
    const count = this.effectStack.count(effect.gameId);
    /*log.info(
      `Stack count of [${effectType[effect.getType()]}]${
        effect.gameId
      }: ${count}, limit is: ${effect.stackLimit}`
    );*/

    if (effect.stackLimit && count > effect.stackLimit) {
      this.effectStack.decrease(effect.id);
      return false;
    }
    return true;
  }

  public disableSkills() {
    this.skills.forEach((s) => {
      s.disable();
    });
  }

  public setBuff(params: any) {
    const { buffType } = params;
    switch (buffType) {
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
    if (this.debuffs.ignoreInvulnerability) return false;
    return this.buffs.isInvulnerable(skill);
  }

  public clearBuffs() {
    this.buffs.clearInvulnerability();
    this.buffs.clearCooldownReduction();
    this.buffs.clearDecreaseDamageTaken();
    this.buffs.clearAbsorbDamage();
    this.buffs.clearDamageIncreasal();
    this.buffs.cannotBeKilled = false;
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

  public getTyping(): Set<CharacterTypes> {
    return this.type;
  }

  public isStunned(skill?: Skill): boolean {
    if (skill) return this.debuffs.isStunned(skill);
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

  public skillByIndex(index:number):Skill{
    if(this.skills[index].mods.replacedBy) return this.skills[index].mods.replacedBy
    else return this.skills[index]
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
