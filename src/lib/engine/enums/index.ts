export enum memberRank {
  Guest,
  Member,
  Admin,
  Webmaster,
}

export enum ReiatsuTypes {
  Hakuda,
  Kidou,
  Reiryoku,
  Zanpakutou,
  Random,
}

export enum CharacterTypes {
  Human,
  Shinigami,
  Hollow,
  Arrancar,
  Captain,
  Visored,
  Fullbringer,
  Ryoka,
  Quincy,
}

export enum effectType {
  Damage,
  Invulnerability,
  DamageReduction,
  CooldownIncreasal,
  CooldownReduction,
  Healing,
  Stun,
  HealthDrain,
  EnergyRemoval,
  EnergyGain,
  EnergySteal,
  SkillTargetMod,
  Counter,
  IncreaseDamageTaken,
  DecreaseDamageTaken,
  EffectRemoval,
  DamageIncreasal,
  AbsorbDamage,
  AlterEffectValue,
  None,
  ResetCooldown,
  DestructibleDefense,
  EnableEffects,
  SkillCostChange,
  IgnoreDecreaseDamageTaken,
  IgnoreInvulnerability,
  DisableEffects,
  IncreaseCasterSkillDuration,
  IncreaseTargetSkillDuration,
  IgnoreEffects,
  ReplaceSkillCost,
  IgnoreDeath,
  ApplyEffect,
  ReplaceSkill,
}

export enum activationType {
  Stunned,
  Damaged,
  Targeted,
  Immediate,
  Expired,
  Killed,
  Healed,
  Countered,
  Reflected,
}

// Must update getValidatedTargets at src/lib/engine/classes/skill/index.ts
// and targetSetter at src/lib/engine/classes/skill/targetValidationFactory.ts
export enum targetType {
  OneEnemy,
  AllEnemies,
  OneAlly,
  AllAllies,
  AllAlliesExceptSelf,
  Any,
  Self,
  OneEnemyAndSelf,
  OneEnemyAndAllAllies,
  OneAllyAndSelf,
  AllEnemiesAndSelf,
  OneAllyOrSelf,
  OneAllyOrSelfAndSelf,
  AllAnyAndSelf,
  AllAny,
  AllAnyExceptSelf,
}

export enum effectTargetBehavior {
  Default,
  OnlyOne,
  AllOthers,
  IfEnemy,
  IfAlly,
  ifSelf,
  Random,
  First,
  Second,
  Third,
  Fourth,
  Fifth,
  Sixth,
  IfAllyIncludingSelf,
}

export enum DamageType {
  None,
  Normal,
  Piercing,
  Affliction,
  True,
  Any,
}

export enum BuffTypes {
  Invulnerability,
  CooldownReduction,
  DecreaseDamageTaken,
  DamageIncreasal,
  AbsorbDamage,
  DestructibleDefense,
}

export enum DebuffTypes {
  DamageReduction,
  CooldownIncreasal,
  Stun,
  IncreaseDamageTaken,
}

export enum CostTypes {
  Speed,
  Strength,
  Elemental,
  Wisdom,
  Random,
}

export enum SkillClassType {
  None,
  Physical,
  Reiatsu,
  Strategic,
  Affliction,
  Any,
  NonStrategic,
}

export enum ControlType {
  Instant,
  Action,
  Control,
}

export enum PlayerPhase {
  EnemyTurn,
  MyTurn,
}

export enum triggerClauseType {
  None,
  onKnockOut,
  IfTargeted,
  IfAlliesUseASkill,
  IfEnemiesUseASkill,
  IfTargetedByHarmfulSkill,
  UsesANewSkill,
  UsesANewNonStrategicSkill,
}
