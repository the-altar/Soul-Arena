"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileQuery = exports.profilesQuery = void 0;
exports.profilesQuery = `
select
	e.id,
	e."data"->'name' as "name",
	e."data"->'description' as description,
	e."data"->'facepic' as facepic
from
	entity e
where
	e.released = true
order by e."data"->'dexNumber';
`;
exports.profileQuery = `
select
	e.id,
	e."data"->'name' as "name",
	e."data"->'description' as description,
	e."data"->'facepic' as facepic,
	jsonb_agg(jsonb_build_object('name', s."data"->'name', 'cost', s."data"->'cost', 'class', s."data"->'class', 'skillpic', s."data"->'skillpic', 'description', s."data"->'description', 'persistence', s."data"->'persistence', 'baseCooldown', s."data"->'baseCooldown') order by s.priority) as skills
from
	entity e
left join skill s on
	s.entity_id = e.id
where
	e.id = $1
group by
	e.id 
`;
//# sourceMappingURL=character.queries.js.map