import { GameEventType, GameObjectSelector } from "gameEvents/types";
import GameObject from "gameObject/GameObject";

class GameEventEmitter {
  static emit(type: GameEventType, sender: GameObject, target: GameObjectSelector, value: unknown = null) {
    const evt = new CustomEvent(type, {
      detail: {
        type,
        sender,
        target,
        value,
      },
    });
    document.dispatchEvent(evt);
  }
}

export default GameEventEmitter;