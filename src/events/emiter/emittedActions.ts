import { GameEventType, TargetType } from "events/types";
import Entity from "entity/Entity";
import GameEventEmitter from "./GameEventEmitter";

const emitMove = (sender: Entity, target: TargetType) => {
	const { x, y } = sender.getPosition();
	GameEventEmitter.emit(
		GameEventType.MOVED,
		sender,
		target,
		{ x, y }
	);
}

const emitDead = (sender: Entity, target: TargetType) => {
	GameEventEmitter.emit(GameEventType.DIED, sender, target);
}

const emitAttack = (sender: Entity, target: TargetType, value: number) => {
	GameEventEmitter.emit(GameEventType.ATTACK, sender, target, value);
}

const emitWait = (sender: Entity, target: TargetType) => {
	GameEventEmitter.emit(
		GameEventType.WAIT,
		sender,
		target,
	);
}

const emitPlayerMakeTurn = (sender: Entity, action: () => unknown) => {
	GameEventEmitter.emit(GameEventType.PLAYER_MAKE_TURN, sender, null, { entityType: sender.getType(), entityId: sender.getId(), action })
}

export { emitMove, emitDead, emitAttack, emitWait, emitPlayerMakeTurn };
