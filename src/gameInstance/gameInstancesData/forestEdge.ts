import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';
import gameInstance from './jsonInstances/forestEdge.json';

const forestEdge: GameInstanceData = {
  ...(gameInstance as GameInstanceData),
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.ROAD_TO_THE_FOREST,
      type: 'gateway',
      x: 0,
      y: 1,
      targetPlayerCoordinates: { x: 23, y: 5 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
    {
      targetGameInstanceKey: GameInstanceKey.ROAD_TO_THE_FOREST,
      type: 'gateway',
      x: 19,
      y: 1,
      targetPlayerCoordinates: { x: 19, y: 5 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
};

export default forestEdge;
