import { GameEventType, GameObjectSelector } from "@/gameEvents/types";
import GameObject from "@/gameObject/GameObject";
import GameEventEmitter from "@/gameEvents/emiter/GameEventEmitter";
import { Coordinates } from "@/types";

const emitMove = (sender: GameObject, target: GameObjectSelector) => {
	const { x, y } = sender.getPosition();
	GameEventEmitter.emit(
		GameEventType.MOVED,
		sender,
		target,
		{ x, y }
	);
}

const emitDead = (sender: GameObject, target: GameObjectSelector) => {
	GameEventEmitter.emit(GameEventType.DIED, sender, target);
}

const emitAttack = (sender: GameObject, target: GameObjectSelector, value: number) => {
	GameEventEmitter.emit(GameEventType.ATTACK, sender, target, value);
}

const emitWait = (sender: GameObject, target: GameObjectSelector) => {
	GameEventEmitter.emit(
		GameEventType.WAIT,
		sender,
		target,
	);
}

const emitPlayerMakeTurn = (sender: GameObject, action: () => unknown) => {
	const playerSelector: GameObjectSelector = { type: sender.getType(), id: sender.getId() }
	GameEventEmitter.emit(GameEventType.PLAYER_MAKE_TURN, sender, null, { performer: playerSelector, action })
}

const emitAnimateEffect = (sender: GameObject, value: { imageKey: string, effectPath: [number, number][] }) => {
	GameEventEmitter.emit(GameEventType.ANIMATE_EFFECT, sender, null, value)
}

export { emitMove, emitDead, emitAttack, emitWait, emitPlayerMakeTurn, emitAnimateEffect };
