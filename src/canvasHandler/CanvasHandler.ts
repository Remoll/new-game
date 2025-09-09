import Entity from "entity/Entity";
import GameMap from "gameMap/GameMap";

class CanvasHandler {
	private entities: Entity[];
	private gameMap: GameMap;
	private ctx: CanvasRenderingContext2D;

	constructor(ctx: CanvasRenderingContext2D, entities: Entity[], gameMap: GameMap) {
		this.ctx = ctx;
		this.entities = entities;
		this.gameMap = gameMap;
	}

	renderGameState() {
		this.gameMap.addToCanvas(this.ctx);
		this.entities.forEach((entity) => {
			if (entity.isAlive()) {
				entity.addToCanvas(this.ctx)
			}
		})
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, 500, 500)
	}
}

export default CanvasHandler;