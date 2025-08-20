import Entity from "entity/Entity";
import { IEntitiesActions, IGameLoop } from "./types";
import Enemy from "entity/enemy/Enemy";

class GameLoop implements IGameLoop {
	entitiesActions: IEntitiesActions[] = [];
	entities: Entity[];

	constructor(entities: Entity[]) {
		this.entities = entities
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
	}

	collectActions() {
		this.entities.forEach((entity) => {
			if (entity.type === "enemy" && entity instanceof Enemy) {
				this.addEntityAction({ entityType: entity.type, entityId: entity.id, action: () => entity.chargePlayer() });
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
