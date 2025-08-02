import { IEntity } from "entity/types";

enum GameEventType {
  ATTACK = "attack",
  MOVED = "moved",
}

interface GameEvent {
  type: GameEventType;
  sender: IEntity;
  target: { type?: string; id?: string };
  value: unknown;
}

export { GameEvent, GameEventType };
