import { GameEventType, GameObjectSelector } from '@/gameEvents/types.ts';
import GameObject from '@/gameObject/GameObject.ts';
import GameEventEmitter from '@/gameEvents/emiter/GameEventEmitter.ts';
import { ProjectileEffectAttributes } from '@/gameObject/item/projectile/fireWand/types.ts';

const emitMove = (sender: GameObject, target: GameObjectSelector) => {
  const { x, y } = sender.getPosition();
  GameEventEmitter.emit(GameEventType.MOVED, sender, target, { x, y });
};

const emitDead = (sender: GameObject, target: GameObjectSelector) => {
  GameEventEmitter.emit(GameEventType.DIED, sender, target);
};

const emitAttack = (
  sender: GameObject,
  target: GameObjectSelector,
  value: number
) => {
  GameEventEmitter.emit(GameEventType.ATTACK, sender, target, value);
};

const emitWait = (sender: GameObject, target: GameObjectSelector) => {
  GameEventEmitter.emit(GameEventType.WAIT, sender, target);
};

const emitPlayerMakeTurn = (sender: GameObject, action: () => unknown) => {
  const playerSelector: GameObjectSelector = {
    type: sender.getType(),
    id: [sender.getId()],
  };
  GameEventEmitter.emit(GameEventType.PLAYER_MAKE_TURN, sender, null, {
    performer: playerSelector,
    action,
  });
};

const emitPlayerEndsTurn = () => {
  GameEventEmitter.emit(GameEventType.PLAYER_ENDS_TURN, null, null, null);
};

const emitAnimateEffect = (
  sender: GameObject,
  value: ProjectileEffectAttributes
) => {
  GameEventEmitter.emit(GameEventType.ANIMATE_EFFECT, sender, null, value);
};

export {
  emitMove,
  emitDead,
  emitAttack,
  emitWait,
  emitPlayerMakeTurn,
  emitAnimateEffect,
  emitPlayerEndsTurn,
};
