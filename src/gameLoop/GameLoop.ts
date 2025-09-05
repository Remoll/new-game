import Entity from "entity/Entity";
import { IEntitiesActions, IGameLoop } from "./types";
import Enemy from "entity/enemy/Enemy";
import GameMap from "gameMap/GameMap";
import CanvasHandler from "canvasHandler/CanvasHandler";

class GameLoop implements IGameLoop {
	entitiesActions: IEntitiesActions[] = [];
	entities: Entity[];
	gameMap: GameMap;
	canvasHandler: CanvasHandler;
	ctx;

	constructor(entities: Entity[], gameMap: GameMap, ctx) {
		this.entities = entities;
		this.gameMap = gameMap;
		this.ctx = ctx;
		this.canvasHandler = new CanvasHandler(this.ctx, this.entities, this.gameMap)
		this.canvasHandler.renderGameState();
	}

	rerenderGameState() {
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
		this.rerenderGameState();
	}

	collectActions() {
		this.entities.forEach((entity) => {
			if (entity.getType() === "enemy" && entity instanceof Enemy && entity.isAlive()) {
				this.addEntityAction({ entityType: entity.getType(), entityId: entity.getId(), action: () => entity.chargePlayer() });
			}
		})
	}

	addEntityAction(newAction: IEntitiesActions) {
		this.entitiesActions.push(newAction);
	};

	resetEntitiesActions() {
		this.entitiesActions = [];
	};
};

export default GameLoop;
