import { Disposition, Faction } from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from './types.ts';

const gameInstanceData: GameInstanceData = {
  mapSize: {
    width: 30,
    height: 7,
  },
  buildingsCoordinates: [
    {
      topLeft: {
        x: 0,
        y: 0,
      },
      bottomRight: {
        x: 7,
        y: 4,
      },
      doors: [
        {
          coordinates: {
            x: 3,
            y: 4,
          },
          isClosed: false,
        },
      ],
    },
    {
      topLeft: {
        x: 9,
        y: 0,
      },
      bottomRight: {
        x: 16,
        y: 4,
      },
      doors: [
        {
          coordinates: {
            x: 12,
            y: 4,
          },
          isClosed: false,
        },
      ],
    },
    {
      topLeft: {
        x: 20,
        y: 0,
      },
      bottomRight: {
        x: 20,
        y: 6,
      },
      doors: [
        {
          coordinates: {
            x: 20,
            y: 3,
          },
          isClosed: true,
        },
      ],
    },
  ],
  npcs: [
    {
      speed: 4,
      type: 'enemy',
      x: 12,
      y: 1,
      imagesKeys: {
        default: ImageKey.FIRE_ELEMENTAL,
        dead: ImageKey.PILE_OF_DUST,
      },
      faction: Faction.ENEMY,
      hp: 300,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
  ],
  items: [],
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.INSTANCE_03,
      type: 'gateway',
      x: 11,
      y: 2,
      targetPlayerCoordinates: { x: 20, y: 48 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
    {
      targetGameInstanceKey: GameInstanceKey.INSTANCE_01,
      type: 'gateway',
      x: 0,
      y: 5,
      targetPlayerCoordinates: { x: 0, y: 0 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
    {
      targetGameInstanceKey: GameInstanceKey.INSTANCE_01,
      type: 'gateway',
      x: 29,
      y: 5,
      targetPlayerCoordinates: { x: 19, y: 0 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
  ],
};

export default gameInstanceData;
