import { GameEventType, TargetType } from "events/types";
import Entity from "entity/Entity";

class GameEventEmitter {
  static emit(type: GameEventType, sender: Entity, target: TargetType, value: unknown = null) {
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