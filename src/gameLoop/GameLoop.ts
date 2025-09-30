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
	private static instance: GameLoop | null = null;
	private gameObjects: GameObject[];
	private gameMap: GameMap;
	private canvasHandler: CanvasHandler;
	private ctx: CanvasRenderingContext2D;
	private isPlayerTurn: boolean = false;

	private constructor(gameObjects: GameObject[], gameMap: GameMap, ctx: CanvasRenderingContext2D) {
		this.gameObjects = gameObjects;
		this.gameMap = gameMap;
		this.ctx = ctx;
		this.canvasHandler = new CanvasHandler(this.ctx, this.gameObjects, this.gameMap)
		this.canvasHandler.renderGameState();
	}

	static getInstance(gameObjects?: GameObject[], gameMap?: GameMap, ctx?: CanvasRenderingContext2D): GameLoop {
		if (!GameLoop.instance && gameObjects && gameMap && ctx) {
			GameLoop.instance = new GameLoop(gameObjects, gameMap, ctx);
		}
		return GameLoop.instance;
	}

	setGameObjects(gameObjects: GameObject[]) {
		this.gameObjects = gameObjects;
		this.canvasHandler.setGameObjects(gameObjects);
	}

	setGameMap(gameMap: GameMap) {
		this.gameMap = gameMap;
		this.canvasHandler.setGameMap(gameMap);
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
		this.ctx.drawImage(ImageManager.instance.getImage(value.imageKey), x * fieldSize, y * fieldSize, fieldSize, fieldSize)

		if (value.effectPath.length > 0) {
			await new Promise(resolve => setTimeout(resolve, 20));
			return this.animateEffect({ imageKey: value.imageKey, effectPath: value.effectPath });
		} else {
			await new Promise(resolve => setTimeout(resolve, 20));
			this.refreshGameState();
		}
	}

	private generateTurnLine(): Entity[] {
		const aliveEntities: Entity[] = this.gameObjects.filter((gameObject) => {
			return gameObject instanceof Entity && gameObject.isAlive();
		}) as Entity[];

		const remainingEntitiesSpeed = aliveEntities.map((entity) => ({ id: entity.getId(), remainingSpeed: entity.getSpeed() }))

		let heightestSpeed = remainingEntitiesSpeed.reduce((max, entity) => entity.remainingSpeed > max ? entity.remainingSpeed : max, 0);

		const turnLine: string[] = []

		do {
			const fastestEntities = remainingEntitiesSpeed.filter((entity) => entity.remainingSpeed === heightestSpeed)
			const randomizedFastestEntities = fastestEntities.sort(() => Math.random() - 0.5) // randomize order of entities with same speed

			turnLine.push(...randomizedFastestEntities.map((entity) => entity.id))

			fastestEntities.forEach((enity) => enity.remainingSpeed--)
			heightestSpeed--;
		} while (remainingEntitiesSpeed.some((entity) => entity.remainingSpeed > 0))

		return turnLine.map((id) => aliveEntities.find((entity) => entity.getId() === id));
	}

	async playerStartTurn(newAction: EntitiesActions) {
		if (this.isPlayerTurn) {
			await newAction.action();
			this.isPlayerTurn = false;
			emitPlayerEndsTurn();
		}
	}

	private npcTakeTurn(npc: Npc) {
		if (npc.isAlive()) {
			npc.takeTurn();
		}
		document.dispatchEvent(new CustomEvent("entityEndTurn"));
	}

	private async entityStartTurn(turnLine: Entity[], index: number) {
		const nextEntityStartTurn = () => {
			this.refreshGameState();
			document.removeEventListener("entityEndTurn", nextEntityStartTurn);
			document.removeEventListener(GameEventType.PLAYER_ENDS_TURN, nextEntityStartTurn)
			index++;

			if (index === turnLine.length - 1) {
				this.executeTurn();
				return;
			} else {
				this.entityStartTurn(turnLine, index);
			}
		}

		const nextEntity = turnLine[index];

		if (nextEntity instanceof Player) {
			this.isPlayerTurn = true;
			document.addEventListener(GameEventType.PLAYER_ENDS_TURN, nextEntityStartTurn)
		} else if (nextEntity instanceof Npc) {
			document.addEventListener("entityEndTurn", nextEntityStartTurn);
			this.npcTakeTurn(nextEntity)
		}
	}

	executeTurn() {
		const player = GameState.getPlayer();

		if (!player) {
			console.log("Player not found - can't execute turn");
			return;
		}

		if (!player.isAlive()) {
			console.log("Player is dead - can't execute turn");
			return;
		}

		const turnLine: Entity[] = this.generateTurnLine();
		this.entityStartTurn(turnLine, 0);
	}
};

export default GameLoop;
