import GameObject from "@/gameObject/GameObject";
import GameMap from "@/gameMap/GameMap";
import { Coordinates } from "@/types";
import Player from "@/gameObject/entity/player/Player";
import GameState from "@/game/GameState";
import { FieldOfView } from "./types";
import Field from "@/gameMap/field/Field";
import ImageManager from "@/imageManager/ImageManager";
import { ImageKey } from "@/imageManager/types";
import Block from "@/gameObject/block/Block";
import Item from "@/gameObject/item/Item";
import Entity from "@/gameObject/entity/Entity";
import Gateway from "@/gameObject/gateway/Gateway";
import Workshop from "@/gameObject/workshop/Workshop";
import Chest from "@/gameObject/chest/Chest";

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

		const fieldSize: number = GameState.getFieldSize();

		const outOfMapCoordinates: Coordinates[] = []

		for (let x = fieldOfView.start.x; x <= fieldOfView.end.x; x++) {
			for (let y = fieldOfView.start.y; y <= fieldOfView.end.y; y++) {
				const isFieldOnMap = fields.some((field) => field.getPosition().x === x && field.getPosition().y === y)

				if (!isFieldOnMap) {
					outOfMapCoordinates.push({ x, y })
				}
			}
		}

		outOfMapCoordinates.forEach((coordinates) => {
			this.ctx.drawImage(ImageManager.instance.getImage(ImageKey.STONE_BLICK_DARK), (coordinates.x - playerAndCenterDifference.x) * fieldSize, (coordinates.y - playerAndCenterDifference.y) * fieldSize, fieldSize, fieldSize)
		})

		const fieldsOnView = fields.filter((field) => {
			const isFieldOnVie = this.checkIsElementOnFieldOfView(fieldOfView, field.getPosition());

			if (!isFieldOnVie) {
				return false;
			}

			return GameState.hasLineOfSight(playerCoordinates.x, playerCoordinates.y, field.getPosition().x, field.getPosition().y, { ignoreEntities: true }).clear
		})

		const gameObjectsOnView = this.gameObjects.filter((gameObject) => {
			return fieldsOnView.some((field) => field.getPosition().x === gameObject.getPosition().x && field.getPosition().y === gameObject.getPosition().y)
		})

		fieldsOnView.forEach((field) => {
			field.addToCanvas(this.ctx, playerAndCenterDifference, fieldSize)
		})

		const blocksToRender: Block[] = [];
		const gatewaysToRender: Gateway[] = [];
		const workshopsToRender: Workshop[] = [];
		const chestsToRender: Chest[] = [];
		const deadEntitiesToRender: Entity[] = [];
		const itemsToRender: Item[] = [];
		const aliveEntitiesToRender: Entity[] = [];
		const restGameObjectsToRender: GameObject[] = [];

		for (const gameObject of gameObjectsOnView) {
			if (gameObject instanceof Block) {
				blocksToRender.push(gameObject);
			} else if (gameObject instanceof Gateway) {
				gatewaysToRender.push(gameObject);
			} else if (gameObject instanceof Workshop) {
				workshopsToRender.push(gameObject);
			} else if (gameObject instanceof Chest) {
				chestsToRender.push(gameObject);
			} else if (gameObject instanceof Item) {
				itemsToRender.push(gameObject);
			} else if (gameObject instanceof Entity) {
				if (gameObject.isAlive()) {
					aliveEntitiesToRender.push(gameObject);
				} else {
					deadEntitiesToRender.push(gameObject);
				}
			} else {
				restGameObjectsToRender.push(gameObject);
			}
		}

		const sortedGameObjectsToRender: GameObject[] = [
			...blocksToRender,
			...gatewaysToRender,
			...workshopsToRender,
			...chestsToRender,
			...deadEntitiesToRender,
			...itemsToRender,
			...aliveEntitiesToRender,
			...restGameObjectsToRender,
		];

		sortedGameObjectsToRender.forEach((gameObject) => {
			gameObject.addToCanvas(this.ctx, playerAndCenterDifference, fieldSize)
		})



	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, 1100, 1100)
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, 1100, 1100);
	}
}

export default CanvasHandler;