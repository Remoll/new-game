import Entity from "entity/Entity";

enum GameEventType {
  MOVED = "moved",
  ATTACK = "attack",
  WAIT = "wait",
  DIED = "died",
  PLAYER_MAKE_TURN = "playermaketurn",
}

interface TargetType {
  type?: string;
  id?: string;
}

interface GameEvent {
  type: GameEventType;
  sender: Entity;
  target: TargetType;
  value: unknown;
}

export { GameEvent, GameEventType, TargetType };
