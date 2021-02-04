"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
const enums_1 = require("../../enums");
const skill_1 = require("../skill");
const buffs_1 = require("./buffs");
const notifications_1 = require("./notifications");
const debuffs_1 = require("./debuffs");
const effetStack_1 = require("./effetStack");
const counters_1 = require("./counters");
const skillstack_1 = require("./skillstack");
const logger_1 = require("../../../logger");
class Character {
    constructor(data, playerId, world, index) {
        this.buffs = new buffs_1.Buffs();
        this.debuffs = new debuffs_1.Debuffs();
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
        this.effectStack = new effetStack_1.EffectStack();
        this.counterStack = new counters_1.CounterStack();
        this.skillStack = new skillstack_1.SkillStack();
        this.myIndex = index;
        for (const skill of data.skills) {
            this.skills.push(new skill_1.Skill(skill, this.id, this.arenaReference, this));
        }
    }
    setAllies(allies) {
        this.allies = allies;
    }
    getAllies() {
        return this.allies;
    }
    getEnemies() {
        return this.enemies;
    }
    setEnemies(enemies) {
        this.enemies = enemies;
    }
    geHitPoints() {
        return this.hitPoints;
    }
    setHitPoints(hp) {
        if (!hp && hp !== 0) {
            logger_1.log.info(`[GAME] problem setting health ${hp}`);
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
        }
        else if (this.hitPoints > 100)
            this.hitPoints = 100;
    }
    belongsTo(id) {
        return this.belongs[id];
    }
    lowerCooldowns(char) {
        for (const skill of this.skills) {
            skill.lowerCooldown(0);
            skill.clearMods();
        }
    }
    generateEnergy() {
        let index = this.energyGain[Math.floor(Math.random() * this.energyGain.length)];
        if (index === 4) {
            index = Math.floor(Math.random() * 3);
        }
        return index;
    }
    getEnergyGain() {
        return this.energyGain;
    }
    getOwner() {
        return Number(Object.keys(this.belongs)[0]);
    }
    validadeSkillsCompletely(pool, chars, playerId, self) {
        for (const skill of this.skills) {
            skill.setTurnCost();
            if (this.isStunned(skill)) {
                skill.disable();
            }
            else {
                skill.enable();
                skill.validateCoolDown();
                skill.validateCost(pool);
                skill.setTargetChoices(chars, playerId, self);
            }
        }
    }
    validateSkillsCost(pool) {
        for (const skill of this.skills) {
            if (this.isStunned(skill)) {
                skill.disable();
            }
            else {
                skill.enable();
                skill.validateCoolDown();
                skill.validateCost(pool);
            }
        }
    }
    getCopySkillByIndex(index) {
        const newObj = JSON.parse(JSON.stringify(this.skills[index].getCopyData()));
        return new skill_1.Skill(newObj, this.id, this.arenaReference, this);
    }
    getRealSkillByIndex(index) {
        return this.skills[index];
    }
    getRealSkillById(id) {
        for (const skill of this.skills) {
            if (skill.getId() === id)
                return skill;
        }
        return null;
    }
    setSkillCooldownByIndex(index) {
        const cdr1 = this.buffs.cooldownReduction.ofAllSkills || 0;
        const cdr2 = this.buffs.cooldownReduction.ofSkillId[this.skills[index].getId()] || 0;
        const n = this.debuffs.getCooldownIncreasal() - (cdr1 + cdr2);
        this.skills[index].startCooldown(n);
    }
    enableSkills() {
        this.skills.forEach((s) => {
            s.disabled = false;
        });
    }
    knockOut() {
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
    isKnockedOut() {
        return this.knockedOut;
    }
    addEffectStack(effect) {
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
    disableSkills() {
        this.skills.forEach((s) => {
            s.disable();
        });
    }
    setBuff(params) {
        const { buffType } = params;
        switch (buffType) {
            case enums_1.BuffTypes.AbsorbDamage:
                {
                    this.buffs.setAbsorbDamage(params);
                }
                break;
        }
    }
    setDebuff(params) {
        switch (params.debuffType) {
            case enums_1.DebuffTypes.CooldownIncreasal:
                {
                    this.debuffs.setCooldownIncreasal(params);
                }
                break;
        }
    }
    isInvulnerable(skill) {
        if (this.debuffs.ignoreInvulnerability)
            return false;
        return this.buffs.isInvulnerable(skill);
    }
    clearBuffs() {
        this.buffs.clearInvulnerability();
        this.buffs.clearCooldownReduction();
        this.buffs.clearDecreaseDamageTaken();
        this.buffs.clearAbsorbDamage();
        this.buffs.clearDamageIncreasal();
        this.buffs.cannotBeKilled = false;
        this.buffs.validateDD();
    }
    clearEnemyPhaseBuffs() {
        this.buffs.clearInvulnerability();
    }
    clearPlayerPhaseBuffs() {
        this.buffs.clearCooldownReduction();
    }
    getBuffs() {
        return this.buffs;
    }
    getDebuffs() {
        return this.debuffs;
    }
    clearDebuffs() {
        this.debuffs.clearDebuffs();
    }
    getId() {
        return this.id;
    }
    getTyping() {
        return this.type;
    }
    isStunned(skill) {
        if (skill)
            return this.debuffs.isStunned(skill);
    }
    getSkills() {
        return this.skills;
    }
    clearSkillMods() {
        for (const skill of this.skills) {
            skill.clearMods();
        }
    }
    addNotification(data) {
        this.notifications.push(new notifications_1.Notification(data));
    }
    clearNotifications() {
        this.notifications = [];
    }
    findSkillById(id) {
        for (const skill of this.skills) {
            if (skill.getId() === id)
                return skill;
        }
    }
    getPublicData() {
        const publicData = Object.assign({}, this);
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
        return Object.assign(Object.assign({}, publicData), { skills: skillCopy });
    }
}
exports.Character = Character;
//# sourceMappingURL=index.js.map