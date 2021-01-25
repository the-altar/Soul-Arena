export const gameStatsQuery = `
select
	(
	select
		count(*)
	from
		game_stats gs) as games_played,
	e."data"->'name' as "name",
	e."data"->'facepic' as facepic,
	e.id,
	e.games_won,
	e.games_lost,
	(e.games_lost + e.games_won) as games_total
from
	entity e
`;
