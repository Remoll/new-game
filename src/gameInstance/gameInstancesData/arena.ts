import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';
import gameInstance from './jsonInstances/arena.json';

const arena: GameInstanceData = {
  ...(gameInstance as GameInstanceData),
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.ROAD_TO_THE_FOREST,
      type: 'gateway',
      x: 2,
      y: 2,
      targetPlayerCoordinates: { x: 23, y: 5 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
};

export default arena;
