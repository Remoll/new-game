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
}

interface DispositionToFactions {
	[Disposition.HOSTILE]?: Faction[];
	[Disposition.NEUTRAL]?: Faction[];
	[Disposition.FRIENDLY]?: Faction[];
}

interface EntityAttributes {
	hp?: number;
	isPasive?: boolean;
	canOccupiedFields?: boolean;
	isInteractive?: boolean;
	faction?: Faction;
	dispositionToFactions?: DispositionToFactions;
}

export { EntityAttributes, Direction, Disposition, Faction, DispositionToFactions };
