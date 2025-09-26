import GameObject from "@/gameObject/GameObject";
import GameMap from "@/gameMap/GameMap";
import { Coordinates } from "@/types";
import Player from "@/gameObject/entity/player/Player";
import GameState from "@/game/GameState";
import { FieldOfView } from "./types";
import Field from "@/gameMap/field/Field";

class CanvasHandler {
	private gameObjects: GameObject[];
	private gameMap: GameMap;
	private ctx: CanvasRenderingContext2D;

	constructor(ctx: CanvasRenderingContext2D, gameObjects: GameObject[], gameMap: GameMap) {
		this.ctx = ctx;
		this.gameObjects = gameObjects;
		this.gameMap = gameMap;
	}

	setGameObjects(gameObjects: GameObject[]) {
		this.gameObjects = gameObjects;
	}

	setGameMap(gameMap: GameMap) {
		this.gameMap = gameMap;
	}

	private getFieldOfView(playerPosition: Coordinates): FieldOfView {
		const viewRange: number = GameState.getViewRange();

		const startX = playerPosition.x - viewRange
		const startY = playerPosition.y - viewRange
		const endX = playerPosition.x + viewRange
		const endY = playerPosition.y + viewRange

		const fieldOfView: FieldOfView = { start: { x: startX, y: startY }, end: { x: endX, y: endY } };

		return fieldOfView;
	}

	checkIsElementOnFieldOfView(fieldOfView: FieldOfView, elementCoordinates: Coordinates): boolean {
		const { start, end } = fieldOfView;
		const { x, y } = elementCoordinates;

		return start.x <= x && x <= end.x && start.y <= y && y <= end.y
	}

	renderGameState() {
		const player: Player = this.gameObjects.find((gameObject) => gameObject instanceof Player);
		const playerCoordinates: Coordinates = player.getPosition();
		const viewRange: number = GameState.getViewRange();

		const playerAndCenterDifference: Coordinates = { x: playerCoordinates.x - viewRange, y: playerCoordinates.y - viewRange }

		GameState.setPlayerAndCenterDifference(playerAndCenterDifference);

		const fieldOfView: FieldOfView = this.getFieldOfView(playerCoordinates);

		const fields: Field[] = this.gameMap.getFields();
		const fieldsOnView = fields.filter((field) => {
			return this.checkIsElementOnFieldOfView(fieldOfView, field.getPosition())
		})

		const gameObjectsOnView = this.gameObjects.filter((gameObject) => {
			return this.checkIsElementOnFieldOfView(fieldOfView, gameObject.getPosition())
		})

		const fieldSize: number = GameState.getFieldSize();

		fieldsOnView.forEach((field) => {
			field.addToCanvas(this.ctx, playerAndCenterDifference, fieldSize)
		})

		gameObjectsOnView.forEach((gameObject) => {
			gameObject.addToCanvas(this.ctx, playerAndCenterDifference, fieldSize)
		})
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, 1100, 1100)
	}
}

export default CanvasHandler;