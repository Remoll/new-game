import GameObject from "@/gameObject/GameObject";
import { Faction } from "@/gameObject/types";

enum GameEventType {
  MOVED = "moved",
  ATTACK = "attack",
  WAIT = "wait",
  DIED = "died",
  PLAYER_MAKE_TURN = "playermaketurn",
}

interface GameObjectSelector {
  type?: string;
  id?: string;
  factions?: Faction[];
}

interface GameEvent {
  type: GameEventType;
  sender: GameObject;
  target: GameObjectSelector;
  value: unknown;
}

export { GameEvent, GameEventType, GameObjectSelector };
