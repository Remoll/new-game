import GameObject from "gameObject/GameObject";
import GameMap from "gameMap/GameMap";

class CanvasHandler {
	private gameObjects: GameObject[];
	private gameMap: GameMap;
	private ctx: CanvasRenderingContext2D;

	constructor(ctx: CanvasRenderingContext2D, gameObjects: GameObject[], gameMap: GameMap) {
		this.ctx = ctx;
		this.gameObjects = gameObjects;
		this.gameMap = gameMap;
	}

	renderGameState() {
		this.gameMap.addToCanvas(this.ctx);
		this.gameObjects.forEach((gameObject) => {
			gameObject.addToCanvas(this.ctx)
		})
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, 500, 500)
	}
}

export default CanvasHandler;