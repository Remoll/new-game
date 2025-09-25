import GameObject from "@/gameObject/GameObject";
import { EntitiesActions } from "./types";
import GameMap from "@/gameMap/GameMap";
import CanvasHandler from "@/canvasHandler/CanvasHandler";
import Npc from "@/gameObject/entity/npc/Npc";
import ImageManager from "@/imageManager/ImageManager";
import Entity from "@/gameObject/entity/Entity";
import Player from "@/gameObject/entity/player/Player";
import { GameEventType } from "@/gameEvents/types";
import { emitPlayerEndsTurn } from "@/gameEvents/emiter/emittedActions";
import GameState from "@/game/GameState";

class GameLoop {
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
		const fieldSize: number = GameState.getFieldSize();

		this.refreshGameState();
		this.ctx.drawImage(ImageManager.instance.getImage(value.imageKey), x * fieldSize, y * fieldSize)

		if (value.effectPath.length > 0) {
			await new Promise(resolve => setTimeout(resolve, 20));
			return this.animateEffect({ imageKey: value.imageKey, effectPath: value.effectPath });
		} else {
			await new Promise(resolve => setTimeout(resolve, 20));
			this.refreshGameState();
		}
	}

	async playerStartTurn(newAction: EntitiesActions) {
		// TODO: extend it to npcs, wait for all effect animations using events and async await
		await newAction.action();
		emitPlayerEndsTurn();
	}

	executeTurn() {
		const aliveEntities: Entity[] = this.gameObjects.filter((gameObject) => {
			return gameObject instanceof Entity && gameObject.isAlive();
		}) as Entity[];

		const playerIndex = aliveEntities.findIndex((entity) => entity instanceof Player);

		if (playerIndex === -1) {
			throw new Error("No Player in gameLoop");
		}

		const beforePlayer: Npc[] = aliveEntities.slice(0, playerIndex) as Npc[];
		// const player: Player = aliveEntities[playerIndex] as Player;
		const afterPlayer: Npc[] = aliveEntities.slice(playerIndex + 1) as Npc[];

		const executeNpcsMoves = (npcs: Npc[]) => {
			for (let index = 0; index <= npcs.length - 1; index++) {
				npcs[index].takeTurn();
				this.refreshGameState();
			}
		}

		executeNpcsMoves(beforePlayer);

		const continueTurnAfterPlayer = () => {
			this.refreshGameState();
			document.removeEventListener(GameEventType.PLAYER_ENDS_TURN, continueTurnAfterPlayer)
			executeNpcsMoves(afterPlayer)

			this.executeTurn();
		}

		document.addEventListener(GameEventType.PLAYER_ENDS_TURN, continueTurnAfterPlayer)
	}
};

export default GameLoop;
