import { InstanceKey } from "@/game/gameInstanceData/types";
import Field from "@/gameMap/field/Field";
import { ImageKey } from "@/imageManager/types";

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

type DispositionToFactions = {
	[key in Disposition]?: Faction[];
}

interface GameObjectImagesKeys {
	default: ImageKey;
	dead: ImageKey;
}

interface GameObjectAttributes {
	fields: Field[];
	type: string;
	x: number;
	y: number;
	imagesKeys: GameObjectImagesKeys;
	canOccupiedFields: boolean;
	isInteractive: boolean;
}

interface EntityAttributes extends GameObjectAttributes {
	hp: number;
	faction: Faction;
	dispositionToFactions: DispositionToFactions;
}

interface GatewayAttributes extends GameObjectAttributes {
	targetInstanceKey: InstanceKey;
}

export { GameObjectAttributes, EntityAttributes, GatewayAttributes, Direction, Disposition, Faction, DispositionToFactions, GameObjectImagesKeys };
