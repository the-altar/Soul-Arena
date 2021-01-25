export const userQuery = `
select
	u.id,
	u.avatar,
	u.username,
	u.coins,
	t2."name" as "theme",
	jsonb_build_object('elo', lb.elo, 'wins', lb.wins, 'losses', lb.losses, 'streak', lb.streak, 'maxStreak', lb.max_streak, 'exp', lb.experience, 'seasonRank', lb.season_rank, 'seasonLevel', lb.season_level) as season,
	jsonb_build_object('authLevel', ur.auth_level, 'rankName', ur."name") as rank,
	array_agg(obtained_entity.entity_id) as unlocked,
	array_remove(array_agg(u2.theme_id), NULL) AS themes
from
	users as u
left join ladderboard as lb on
	u.id = lb.user_id
left join user_rank as ur on
	u.user_rank_id = ur.id
left join obtained_entity on
	obtained_entity.user_id = u.id
left join theme t2 on
	t2.id = u.preferred_theme
left join usertheme u2 on
	u2.user_id = u.id
where
	u.id = $1
group by
	(u.id,
	t2."name",
	lb.elo,
	lb.wins,
	lb.losses,
	lb.streak,
	lb.max_streak,
	lb.experience,
	lb.season_rank,
	lb.season_level,
	ur.auth_level,
	ur."name");
`;
export const trackMissionQuery = `INSERT INTO tracking_mission
(mission_id, goals, user_id)
VALUES($1, $2, $3);`;

export const missionTrackQuery = `select goals from tracking_mission where user_id = $1 and mission_id = $2`;

export const deleteMissionTrackQuery = `delete
from
    public.tracking_mission
where
    user_id = $1
    and mission_id = $2;`;

export const selectMissionQuery = `select
m2.*,
case
    when cm.user_id is null then false
    else true
end as completed,
case
    when tm.user_id is null then false
    else true
end as tracking
from
    mission m2
left join completed_mission cm on
    cm.mission_id = m2.id
    and cm.user_id = $1
left join tracking_mission tm on 
    tm.user_id = $1 
    and tm.mission_id = m2.id
where m2.released = true;`;

export const selectCharacterQuery = `
select
    jsonb_build_object('id', entity.id, 'isFree', entity.isfree) || entity.data || jsonb_build_object('skills', jsonb_agg(sk.data order by sk.priority)) as data
from
    entity
join skill as sk on
    sk.entity_id = entity.id
where entity.released = true    
group by
    entity.id;        
`;

export const selectMasterCharacterQuery = `
select
    jsonb_build_object('id', entity.id, 'isFree', entity.isfree) || entity.data || jsonb_build_object('skills', jsonb_agg(sk.data order by sk.priority)) as data
from
    entity
join skill as sk on
    sk.entity_id = entity.id 
group by
    entity.id;        
`;
export const selectThemeQuery = `select * from theme where theme."permission" <= $1`;

export const updateUserThemeQuery = `UPDATE users SET preferred_theme=$2 WHERE users.id = $1;
`;
