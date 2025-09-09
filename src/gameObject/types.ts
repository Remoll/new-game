import Field from "gameMap/field/Field";

enum Direction {
	UP = "up",
	DOWN = "down",
	LEFT = "left",
	RIGHT = "right",
}

enum Disposition {
	HOSTILE = "hostile",
	NEUTRAL = "neutral",
	FRIENDLY = "friendly",
}

enum Faction {
	PLAYER = "player_faction",
	ENEMY = "enemy_faction",
	NEUTRAL = "neutral_faction"
}

interface DispositionToFactions {
	[Disposition.HOSTILE]?: Faction[];
	[Disposition.NEUTRAL]?: Faction[];
	[Disposition.FRIENDLY]?: Faction[];
}

interface GameObjectAttributes {
	fields: Field[];
	type: string;
	x: number;
	y: number;
	canOccupiedFields: boolean;
	isInteractive: boolean;
}

interface EntityAttributes extends GameObjectAttributes {
	hp: number;
	faction: Faction;
	dispositionToFactions: DispositionToFactions;
}

export { GameObjectAttributes, EntityAttributes, Direction, Disposition, Faction, DispositionToFactions };
