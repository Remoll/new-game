import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from './types.ts';
import Building from '@/gameMap/building/Building.ts';

const gameInstanceData: GameInstanceData = {
  mapSize: {
    width: 50,
    height: 50,
  },
  buildingsCoordinates: Building.generateRandomBuildingsCoordinates({
    count: 15,
    mapWidth: 50,
    mapHeight: 50,
    minWidth: 5,
    maxWidth: 20,
    minHeight: 5,
    maxHeight: 20,
  }),
  npcs: [],
  items: [],
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.INSTANCE_02,
      type: 'gateway',
      x: 20,
      y: 48,
      targetPlayerCoordinates: { x: 11, y: 2 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
  ],
};

export default gameInstanceData;
