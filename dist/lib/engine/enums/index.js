"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerClauseType = exports.PlayerPhase = exports.ControlType = exports.SkillClassType = exports.CostTypes = exports.DebuffTypes = exports.BuffTypes = exports.DamageType = exports.effectTargetBehavior = exports.targetType = exports.activationType = exports.effectType = exports.CharacterTypes = exports.ReiatsuTypes = exports.memberRank = void 0;
var memberRank;
(function (memberRank) {
    memberRank[memberRank["Guest"] = 0] = "Guest";
    memberRank[memberRank["Member"] = 1] = "Member";
    memberRank[memberRank["Admin"] = 2] = "Admin";
    memberRank[memberRank["Webmaster"] = 3] = "Webmaster";
})(memberRank = exports.memberRank || (exports.memberRank = {}));
var ReiatsuTypes;
(function (ReiatsuTypes) {
    ReiatsuTypes[ReiatsuTypes["Hakuda"] = 0] = "Hakuda";
    ReiatsuTypes[ReiatsuTypes["Kidou"] = 1] = "Kidou";
    ReiatsuTypes[ReiatsuTypes["Reiryoku"] = 2] = "Reiryoku";
    ReiatsuTypes[ReiatsuTypes["Zanpakutou"] = 3] = "Zanpakutou";
    ReiatsuTypes[ReiatsuTypes["Random"] = 4] = "Random";
})(ReiatsuTypes = exports.ReiatsuTypes || (exports.ReiatsuTypes = {}));
var CharacterTypes;
(function (CharacterTypes) {
    CharacterTypes[CharacterTypes["Human"] = 0] = "Human";
    CharacterTypes[CharacterTypes["Shinigami"] = 1] = "Shinigami";
    CharacterTypes[CharacterTypes["Hollow"] = 2] = "Hollow";
    CharacterTypes[CharacterTypes["Arrancar"] = 3] = "Arrancar";
    CharacterTypes[CharacterTypes["Captain"] = 4] = "Captain";
    CharacterTypes[CharacterTypes["Visored"] = 5] = "Visored";
    CharacterTypes[CharacterTypes["Fullbringer"] = 6] = "Fullbringer";
    CharacterTypes[CharacterTypes["Ryoka"] = 7] = "Ryoka";
    CharacterTypes[CharacterTypes["Quincy"] = 8] = "Quincy";
})(CharacterTypes = exports.CharacterTypes || (exports.CharacterTypes = {}));
var effectType;
(function (effectType) {
    effectType[effectType["Damage"] = 0] = "Damage";
    effectType[effectType["Invulnerability"] = 1] = "Invulnerability";
    effectType[effectType["DamageReduction"] = 2] = "DamageReduction";
    effectType[effectType["CooldownIncreasal"] = 3] = "CooldownIncreasal";
    effectType[effectType["CooldownReduction"] = 4] = "CooldownReduction";
    effectType[effectType["Healing"] = 5] = "Healing";
    effectType[effectType["Stun"] = 6] = "Stun";
    effectType[effectType["HealthDrain"] = 7] = "HealthDrain";
    effectType[effectType["EnergyRemoval"] = 8] = "EnergyRemoval";
    effectType[effectType["EnergyGain"] = 9] = "EnergyGain";
    effectType[effectType["EnergySteal"] = 10] = "EnergySteal";
    effectType[effectType["SkillTargetMod"] = 11] = "SkillTargetMod";
    effectType[effectType["Counter"] = 12] = "Counter";
    effectType[effectType["IncreaseDamageTaken"] = 13] = "IncreaseDamageTaken";
    effectType[effectType["DecreaseDamageTaken"] = 14] = "DecreaseDamageTaken";
    effectType[effectType["EffectRemoval"] = 15] = "EffectRemoval";
    effectType[effectType["DamageIncreasal"] = 16] = "DamageIncreasal";
    effectType[effectType["AbsorbDamage"] = 17] = "AbsorbDamage";
    effectType[effectType["AlterEffectValue"] = 18] = "AlterEffectValue";
    effectType[effectType["None"] = 19] = "None";
    effectType[effectType["ResetCooldown"] = 20] = "ResetCooldown";
    effectType[effectType["DestructibleDefense"] = 21] = "DestructibleDefense";
    effectType[effectType["EnableEffects"] = 22] = "EnableEffects";
    effectType[effectType["SkillCostChange"] = 23] = "SkillCostChange";
    effectType[effectType["IgnoreDecreaseDamageTaken"] = 24] = "IgnoreDecreaseDamageTaken";
    effectType[effectType["IgnoreInvulnerability"] = 25] = "IgnoreInvulnerability";
    effectType[effectType["DisableEffects"] = 26] = "DisableEffects";
    effectType[effectType["IncreaseCasterSkillDuration"] = 27] = "IncreaseCasterSkillDuration";
    effectType[effectType["IncreaseTargetSkillDuration"] = 28] = "IncreaseTargetSkillDuration";
    effectType[effectType["IgnoreEffects"] = 29] = "IgnoreEffects";
    effectType[effectType["ReplaceSkillCost"] = 30] = "ReplaceSkillCost";
    effectType[effectType["IgnoreDeath"] = 31] = "IgnoreDeath";
    effectType[effectType["ApplyEffect"] = 32] = "ApplyEffect";
    effectType[effectType["ReplaceSkill"] = 33] = "ReplaceSkill";
})(effectType = exports.effectType || (exports.effectType = {}));
var activationType;
(function (activationType) {
    activationType[activationType["Stunned"] = 0] = "Stunned";
    activationType[activationType["Damaged"] = 1] = "Damaged";
    activationType[activationType["Targeted"] = 2] = "Targeted";
    activationType[activationType["Immediate"] = 3] = "Immediate";
    activationType[activationType["Expired"] = 4] = "Expired";
    activationType[activationType["Killed"] = 5] = "Killed";
    activationType[activationType["Healed"] = 6] = "Healed";
    activationType[activationType["Countered"] = 7] = "Countered";
    activationType[activationType["Reflected"] = 8] = "Reflected";
})(activationType = exports.activationType || (exports.activationType = {}));
// and targetSetter at src/lib/engine/classes/skill/targetValidationFactory.ts
// Must update getValidatedTargets at src/lib/engine/classes/skill/index.ts
var targetType;
(function (targetType) {
    targetType[targetType["OneEnemy"] = 0] = "OneEnemy";
    targetType[targetType["AllEnemies"] = 1] = "AllEnemies";
    targetType[targetType["OneAlly"] = 2] = "OneAlly";
    targetType[targetType["AllAllies"] = 3] = "AllAllies";
    targetType[targetType["AllAlliesExceptSelf"] = 4] = "AllAlliesExceptSelf";
    targetType[targetType["Any"] = 5] = "Any";
    targetType[targetType["Self"] = 6] = "Self";
    targetType[targetType["OneEnemyAndSelf"] = 7] = "OneEnemyAndSelf";
    targetType[targetType["OneEnemyAndAllAllies"] = 8] = "OneEnemyAndAllAllies";
    targetType[targetType["OneAllyAndSelf"] = 9] = "OneAllyAndSelf";
    targetType[targetType["AllEnemiesAndSelf"] = 10] = "AllEnemiesAndSelf";
    targetType[targetType["OneAllyOrSelf"] = 11] = "OneAllyOrSelf";
    targetType[targetType["OneAllyOrSelfAndSelf"] = 12] = "OneAllyOrSelfAndSelf";
    targetType[targetType["AllAnyAndSelf"] = 13] = "AllAnyAndSelf";
    targetType[targetType["AllAny"] = 14] = "AllAny";
    targetType[targetType["AllAnyExceptSelf"] = 15] = "AllAnyExceptSelf";
    targetType[targetType["OneRandomEnemy_and_Self"] = 16] = "OneRandomEnemy_and_Self";
})(targetType = exports.targetType || (exports.targetType = {}));
var effectTargetBehavior;
(function (effectTargetBehavior) {
    effectTargetBehavior[effectTargetBehavior["Default"] = 0] = "Default";
    effectTargetBehavior[effectTargetBehavior["OnlyOne"] = 1] = "OnlyOne";
    effectTargetBehavior[effectTargetBehavior["AllOthers"] = 2] = "AllOthers";
    effectTargetBehavior[effectTargetBehavior["IfEnemy"] = 3] = "IfEnemy";
    effectTargetBehavior[effectTargetBehavior["IfAlly"] = 4] = "IfAlly";
    effectTargetBehavior[effectTargetBehavior["ifSelf"] = 5] = "ifSelf";
    effectTargetBehavior[effectTargetBehavior["Random"] = 6] = "Random";
    effectTargetBehavior[effectTargetBehavior["First"] = 7] = "First";
    effectTargetBehavior[effectTargetBehavior["Second"] = 8] = "Second";
    effectTargetBehavior[effectTargetBehavior["Third"] = 9] = "Third";
    effectTargetBehavior[effectTargetBehavior["Fourth"] = 10] = "Fourth";
    effectTargetBehavior[effectTargetBehavior["Fifth"] = 11] = "Fifth";
    effectTargetBehavior[effectTargetBehavior["Sixth"] = 12] = "Sixth";
    effectTargetBehavior[effectTargetBehavior["IfAllyIncludingSelf"] = 13] = "IfAllyIncludingSelf";
})(effectTargetBehavior = exports.effectTargetBehavior || (exports.effectTargetBehavior = {}));
var DamageType;
(function (DamageType) {
    DamageType[DamageType["None"] = 0] = "None";
    DamageType[DamageType["Normal"] = 1] = "Normal";
    DamageType[DamageType["Piercing"] = 2] = "Piercing";
    DamageType[DamageType["Affliction"] = 3] = "Affliction";
    DamageType[DamageType["True"] = 4] = "True";
    DamageType[DamageType["Any"] = 5] = "Any";
})(DamageType = exports.DamageType || (exports.DamageType = {}));
var BuffTypes;
(function (BuffTypes) {
    BuffTypes[BuffTypes["Invulnerability"] = 0] = "Invulnerability";
    BuffTypes[BuffTypes["CooldownReduction"] = 1] = "CooldownReduction";
    BuffTypes[BuffTypes["DecreaseDamageTaken"] = 2] = "DecreaseDamageTaken";
    BuffTypes[BuffTypes["DamageIncreasal"] = 3] = "DamageIncreasal";
    BuffTypes[BuffTypes["AbsorbDamage"] = 4] = "AbsorbDamage";
    BuffTypes[BuffTypes["DestructibleDefense"] = 5] = "DestructibleDefense";
})(BuffTypes = exports.BuffTypes || (exports.BuffTypes = {}));
var DebuffTypes;
(function (DebuffTypes) {
    DebuffTypes[DebuffTypes["DamageReduction"] = 0] = "DamageReduction";
    DebuffTypes[DebuffTypes["CooldownIncreasal"] = 1] = "CooldownIncreasal";
    DebuffTypes[DebuffTypes["Stun"] = 2] = "Stun";
    DebuffTypes[DebuffTypes["IncreaseDamageTaken"] = 3] = "IncreaseDamageTaken";
})(DebuffTypes = exports.DebuffTypes || (exports.DebuffTypes = {}));
var CostTypes;
(function (CostTypes) {
    CostTypes[CostTypes["Speed"] = 0] = "Speed";
    CostTypes[CostTypes["Strength"] = 1] = "Strength";
    CostTypes[CostTypes["Elemental"] = 2] = "Elemental";
    CostTypes[CostTypes["Wisdom"] = 3] = "Wisdom";
    CostTypes[CostTypes["Random"] = 4] = "Random";
})(CostTypes = exports.CostTypes || (exports.CostTypes = {}));
var SkillClassType;
(function (SkillClassType) {
    SkillClassType[SkillClassType["None"] = 0] = "None";
    SkillClassType[SkillClassType["Physical"] = 1] = "Physical";
    SkillClassType[SkillClassType["Reiatsu"] = 2] = "Reiatsu";
    SkillClassType[SkillClassType["Strategic"] = 3] = "Strategic";
    SkillClassType[SkillClassType["Affliction"] = 4] = "Affliction";
    SkillClassType[SkillClassType["Any"] = 5] = "Any";
    SkillClassType[SkillClassType["NonStrategic"] = 6] = "NonStrategic";
})(SkillClassType = exports.SkillClassType || (exports.SkillClassType = {}));
var ControlType;
(function (ControlType) {
    ControlType[ControlType["Instant"] = 0] = "Instant";
    ControlType[ControlType["Action"] = 1] = "Action";
    ControlType[ControlType["Control"] = 2] = "Control";
})(ControlType = exports.ControlType || (exports.ControlType = {}));
var PlayerPhase;
(function (PlayerPhase) {
    PlayerPhase[PlayerPhase["MyTurn"] = 0] = "MyTurn";
    PlayerPhase[PlayerPhase["EnemyTurn"] = 1] = "EnemyTurn";
})(PlayerPhase = exports.PlayerPhase || (exports.PlayerPhase = {}));
var triggerClauseType;
(function (triggerClauseType) {
    triggerClauseType[triggerClauseType["None"] = 0] = "None";
    triggerClauseType[triggerClauseType["onKnockOut"] = 1] = "onKnockOut";
    triggerClauseType[triggerClauseType["IfTargeted"] = 2] = "IfTargeted";
    triggerClauseType[triggerClauseType["IfAlliesUseASkill"] = 3] = "IfAlliesUseASkill";
    triggerClauseType[triggerClauseType["IfEnemiesUseASkill"] = 4] = "IfEnemiesUseASkill";
    triggerClauseType[triggerClauseType["IfTargetedByHarmfulSkill"] = 5] = "IfTargetedByHarmfulSkill";
    triggerClauseType[triggerClauseType["UsesANewSkill"] = 6] = "UsesANewSkill";
    triggerClauseType[triggerClauseType["UsesANewNonStrategicSkill"] = 7] = "UsesANewNonStrategicSkill";
})(triggerClauseType = exports.triggerClauseType || (exports.triggerClauseType = {}));
//# sourceMappingURL=index.js.map