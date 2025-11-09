import { Disposition, Faction } from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';

const gameInstanceData: GameInstanceData = {
  mapSize: {
    x: 21,
    y: 21,
  },
  buildingsCoordinates: [
    {
      topLeft: {
        x: 3,
        y: 3,
      },
      bottomRight: {
        x: 17,
        y: 17,
      },
      doors: [
        {
          coordinates: {
            x: 6,
            y: 3,
          },
          isClosed: false,
        },
      ],
    },
  ],
  npcs: [
    {
      speed: 3,
      type: 'dog',
      x: 5,
      y: 5,
      imagesKeys: { default: ImageKey.DOG, dead: ImageKey.DOG_DEAD },
      faction: Faction.ENEMY,
      hp: 150,
      defaultDamageValue: 20,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'enemy',
      x: 7,
      y: 7,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.ENEMY,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'enemy',
      x: 10,
      y: 5,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.ENEMY,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'enemy',
      x: 5,
      y: 1,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.ENEMY,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'enemy',
      x: 18,
      y: 18,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.ENEMY,
      hp: 100,
      defaultDamageValue: 10,
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
      targetGameInstanceKey: GameInstanceKey.INSTANCE_02,
      type: 'gateway',
      x: 0,
      y: 0,
      targetPlayerCoordinates: { x: 0, y: 5 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
    {
      targetGameInstanceKey: GameInstanceKey.INSTANCE_02,
      type: 'gateway',
      x: 19,
      y: 0,
      targetPlayerCoordinates: { x: 29, y: 5 },
      imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY },
      canOccupiedFields: false,
      isInteractive: true,
    },
  ],
  workshops: [
    {
      type: 'workshop',
      x: 4,
      y: 4,
      imagesKeys: { default: ImageKey.LABORATORY, dead: ImageKey.LABORATORY },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
  chests: [
    {
      itemsProps: [
        {
          type: 'reanimatePotion',
          x: 1,
          y: 2,
          imagesKeys: { default: ImageKey.POTION, dead: ImageKey.POTION },
          canOccupiedFields: false,
          isInteractive: true,
        },
      ],
      type: 'chest',
      x: 5,
      y: 4,
      imagesKeys: { default: ImageKey.CHEST, dead: ImageKey.CHEST },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
};

export default gameInstanceData;
