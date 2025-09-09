import Entity from "entity/Entity";
import { EntitiesActions } from "./types";
import Enemy from "entity/enemy/Enemy";
import GameMap from "gameMap/GameMap";
import CanvasHandler from "canvasHandler/CanvasHandler";

class GameLoop {
	private entitiesActions: EntitiesActions[] = [];
	private entities: Entity[];
	private gameMap: GameMap;
	private canvasHandler: CanvasHandler;
	private ctx: CanvasRenderingContext2D;

	constructor(entities: Entity[], gameMap: GameMap, ctx: CanvasRenderingContext2D) {
		this.entities = entities;
		this.gameMap = gameMap;
		this.ctx = ctx;
		this.canvasHandler = new CanvasHandler(this.ctx, this.entities, this.gameMap)
		this.canvasHandler.renderGameState();
	}

	private refreshGameState() {
		this.canvasHandler.clearCanvas()
		this.canvasHandler.renderGameState();
	}

	executeTurn() {
		// Enemy first
		const enemyActions = this.entitiesActions.filter((entity) => entity.entityType === "enemy")
		enemyActions.forEach((action) => {
			action.action();
		})

		// Player second
		const playerAction = this.entitiesActions.filter((entity) => entity.entityType === "player")[0]
		playerAction.action();
		this.refreshGameState();
	}

	collectActions() {
		this.entities.forEach((entity) => {
			if (entity.getType() === "enemy" && entity instanceof Enemy && entity.isAlive()) {
				this.addEntityAction({ entityType: entity.getType(), entityId: entity.getId(), action: () => entity.takeTurn() });
			}
		})
	}

	addEntityAction(newAction: EntitiesActions) {
		this.entitiesActions.push(newAction);
	};

	resetEntitiesActions() {
		this.entitiesActions = [];
	};
};

export default GameLoop;
