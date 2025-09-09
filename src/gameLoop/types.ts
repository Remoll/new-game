import { GameObjectSelector } from "gameEvents/types";

interface EntitiesActions {
	performer: GameObjectSelector;
	action: (...args: unknown[]) => unknown;
}

export { EntitiesActions }