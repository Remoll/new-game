import { BuildingCoordinates } from '@/gameMap/building/types.ts';
import { FieldProps } from '@/gameMap/types.ts';
import {
  EntityProps,
  GameObjectProps,
  GatewayProps,
} from '@/gameObject/types.ts';
import { Coordinates } from '@/types.ts';

interface GameInstanceData {
  mapSize: Coordinates;
  blocks?: GameObjectProps[];
  buildingsCoordinates?: BuildingCoordinates[];
  fields?: FieldProps[];
  npcs: EntityProps[];
  items: GameObjectProps[];
  gateways: GatewayProps[];
  workshops?: GameObjectProps[];
  chests?: GameObjectProps[];
  gameObjects?: GameObjectProps[];
}

enum GameInstanceKey {
  INSTANCE_01 = 'instance01',
  INSTANCE_02 = 'instance02',
  INSTANCE_03 = 'instance03',
  INN = 'inn',
  FOREST_EDGE = 'forestEdge',
  ROAD_TO_THE_FOREST = 'roadToTheForest',
  ARENA = 'arena',
}

export { type GameInstanceData, GameInstanceKey };
