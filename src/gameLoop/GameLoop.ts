import GameObject from "@/gameObject/GameObject";
import { EntitiesActions } from "./types";
import GameMap from "@/gameMap/GameMap";
import CanvasHandler from "@/canvasHandler/CanvasHandler";
import Npc from "@/gameObject/entity/npc/Npc";
import { Coordinates } from "@/types";
import ImageManager from "@/imageManager/ImageManager";

class GameLoop {
	private entitiesActions: EntitiesActions[] = [];
	private gameObjects: GameObject[];
	private gameMap: GameMap;
	private canvasHandler: CanvasHandler;
	private ctx: CanvasRenderingContext2D;

	constructor(gameObjects: GameObject[], gameMap: GameMap, ctx: CanvasRenderingContext2D) {
		this.gameObjects = gameObjects;
		this.gameMap = gameMap;
		this.ctx = ctx;
		this.canvasHandler = new CanvasHandler(this.ctx, this.gameObjects, this.gameMap)
		this.canvasHandler.renderGameState();
	}

	private refreshGameState() {
		this.canvasHandler.clearCanvas()
		this.canvasHandler.renderGameState();
	}

	async animateEffect(value: { imageKey: string, effectPath: [number, number][] }) {
		const nextCoordinates = value.effectPath.shift();

		const [x, y] = nextCoordinates;

		this.refreshGameState();
		this.ctx.drawImage(ImageManager.instance.getImage(value.imageKey), x * 50, y * 50)

		if (value.effectPath.length > 0) {
			await new Promise(resolve => setTimeout(resolve, 20));
			return this.animateEffect({ imageKey: value.imageKey, effectPath: value.effectPath });
		} else {
			this.refreshGameState();
		}

	}

	async executeTurn() {
		// Npcs first
		const npcsActions = this.entitiesActions.filter((entityAction) => entityAction.performer.type !== "player")
		npcsActions.forEach(async (action) => {
			await action.action();
		})

		// Player second
		const playerAction = this.entitiesActions.filter((entityAction) => entityAction.performer.type === "player")[0]
		await playerAction.action();
		this.refreshGameState();
	}

	collectActions() {
		this.gameObjects.forEach((gameObject) => {
			if (gameObject instanceof Npc && gameObject.getType() !== "player" && gameObject.isAlive()) {
				this.addEntityAction({ performer: { type: gameObject.getType(), id: gameObject.getId() }, action: () => gameObject.takeTurn() });
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
