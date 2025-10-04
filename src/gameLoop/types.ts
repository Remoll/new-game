import { GameObjectSelector } from '@/gameEvents/types.ts';

interface EntitiesActions {
  performer: GameObjectSelector;
  action: (...args: unknown[]) => unknown;
}

export { EntitiesActions };
