import { GameEventType, GameObjectSelector } from '@/gameEvents/types.ts';
import GameObject from '@/gameObject/GameObject.ts';

class GameEventEmitter {
  static emit(
    type: GameEventType,
    sender: GameObject,
    target: GameObjectSelector,
    value: unknown = null
  ) {
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
