import { BuildingCoordinates } from '@/gameMap/building/types.ts';
import { FieldAttributes } from '@/gameMap/types.ts';
import {
  EntityAttributes,
  GameObjectAttributes,
  GatewayAttributes,
} from '@/gameObject/types.ts';
import { Coordinates } from '@/types.ts';

interface GameInstanceData {
  mapSize: Coordinates;
  blocks?: GameObjectAttributes[];
  buildingsCoordinates?: BuildingCoordinates[];
  fields?: FieldAttributes[];
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
  FOREST_EDGE = 'forestEdge',
  ROAD_TO_THE_FOREST = 'roadToTheForest',
}

export { type GameInstanceData, GameInstanceKey };
