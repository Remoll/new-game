import { BuildingCoordinates } from '@/gameMap/building/types.ts';
import {
  EntityAttributes,
  GameObjectAttributes,
  GatewayAttributes,
} from '@/gameObject/types.ts';

interface GameInstanceData {
  mapSize: { width: number; height: number };
  buildingsCoordinates: BuildingCoordinates[];
  npcs: EntityAttributes[];
  items: GameObjectAttributes[];
  gateways: GatewayAttributes[];
  workshops?: GameObjectAttributes[];
  chests?: GameObjectAttributes[];
  gameObjects?: GameObjectAttributes[];
}

enum GameInstanceKey {
  INSTANCE_01 = 'instance01',
  INSTANCE_02 = 'instance02',
  INSTANCE_03 = 'instance03',
  INN = 'inn',
}

export { type GameInstanceData, GameInstanceKey };
