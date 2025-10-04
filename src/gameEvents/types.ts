import GameObject from '@/gameObject/GameObject.ts';
import { Faction } from '@/gameObject/types.ts';

enum GameEventType {
  MOVED = 'moved',
  ATTACK = 'attack',
  WAIT = 'wait',
  DIED = 'died',
  PLAYER_MAKE_TURN = 'playermaketurn',
  PLAYER_ENDS_TURN = 'playerendsturn',
  ANIMATE_EFFECT = 'animateeffect',
}

interface GameObjectSelector {
  type?: string;
  id?: string[];
  factions?: Faction[];
}

interface GameEvent {
  type: GameEventType;
  sender: GameObject;
  target: GameObjectSelector;
  value: unknown;
}

export { GameEvent, GameEventType, GameObjectSelector };
