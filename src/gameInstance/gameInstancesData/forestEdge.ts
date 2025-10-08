import { Disposition, Faction } from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';

const gameInstanceData: GameInstanceData = {
  mapSize: { width: 25, height: 25 },

  buildingsCoordinates: [],

  npcs: [
    // 🐗 Dziki
    {
      speed: 2,
      type: 'boar',
      x: 6,
      y: 11,
      imagesKeys: { default: ImageKey.BOAR, dead: ImageKey.BOAR_DEAD },
      faction: Faction.ENEMY,
      hp: 150,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },

    // 🐺 Wilki
    {
      speed: 3,
      type: 'wolf',
      x: 4,
      y: 10,
      imagesKeys: { default: ImageKey.WOLF, dead: ImageKey.WOLF_DEAD },
      faction: Faction.ENEMY,
      hp: 120,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },

    // 😈 Demoniczne impy
    {
      speed: 4,
      type: 'demonicImp',
      x: 15,
      y: 10,
      imagesKeys: { default: ImageKey.IMP, dead: ImageKey.DEMONIC_ORB },
      faction: Faction.ENEMY,
      hp: 100,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 4,
      type: 'demonicImp',
      x: 18,
      y: 13,
      imagesKeys: { default: ImageKey.IMP, dead: ImageKey.DEMONIC_ORB },
      faction: Faction.ENEMY,
      hp: 100,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 4,
      type: 'demonicImp',
      x: 19,
      y: 15,
      imagesKeys: { default: ImageKey.IMP, dead: ImageKey.DEMONIC_ORB },
      faction: Faction.ENEMY,
      hp: 100,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 4,
      type: 'demonicImp',
      x: 20,
      y: 17,
      imagesKeys: { default: ImageKey.IMP, dead: ImageKey.DEMONIC_ORB },
      faction: Faction.ENEMY,
      hp: 100,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },

    // 💀 Szkielety
    {
      speed: 1,
      type: 'skeleton',
      x: 10,
      y: 7,
      imagesKeys: { default: ImageKey.SKELETON, dead: ImageKey.BONES },
      faction: Faction.ENEMY,
      hp: 130,
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
      type: 'skeleton',
      x: 13,
      y: 15,
      imagesKeys: { default: ImageKey.SKELETON, dead: ImageKey.BONES },
      faction: Faction.ENEMY,
      hp: 130,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.PLAYER],
        [Disposition.FRIENDLY]: [Faction.ENEMY],
        [Disposition.NEUTRAL]: [Faction.NEUTRAL],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
  ],

  items: [
    // 🍺 Zaginiona beczka
    {
      type: 'lostBarrel',
      x: 3,
      y: 15,
      imagesKeys: { default: ImageKey.BARREL, dead: ImageKey.BARREL },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],

  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.INN,
      type: 'gateway',
      x: 0,
      y: 13,
      targetPlayerCoordinates: { x: 18, y: 5 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
    // {
    //   targetGameInstanceKey: GameInstanceKey.DEEP_FOREST,
    //   type: 'gateway',
    //   x: 0,
    //   y: 12,
    //   targetPlayerCoordinates: { x: 23, y: 12 },
    //   imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
    //   canOccupiedFields: true,
    //   isInteractive: true,
    // },
  ],

  workshops: [],

  chests: [
    {
      itemsAttributes: [
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
      y: 18,
      imagesKeys: { default: ImageKey.CHEST, dead: ImageKey.CHEST },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],

  gameObjects: [
    // 🌲 Drzewa
    ...[
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 3 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 8, y: 6 },
      { x: 10, y: 4 },
      { x: 11, y: 4 },
      { x: 13, y: 6 },
      { x: 15, y: 7 },
      { x: 16, y: 8 },
      { x: 17, y: 9 },
      { x: 18, y: 10 },
      { x: 19, y: 11 },
      { x: 20, y: 12 },
      { x: 21, y: 13 },
      { x: 22, y: 14 },
      { x: 12, y: 17 },
      { x: 8, y: 18 },
      { x: 9, y: 19 },
      { x: 10, y: 19 },
      { x: 4, y: 20 },
      { x: 5, y: 21 },
      { x: 6, y: 22 },
      { x: 18, y: 22 },
      { x: 19, y: 22 },
    ].map((coord) => ({
      type: 'block',
      x: coord.x,
      y: coord.y,
      imagesKeys: { default: ImageKey.TREE, dead: ImageKey.TREE },
      canOccupiedFields: true,
      isInteractive: false,
    })),

    // 💧 Woda
    ...[
      { x: 3, y: 14 },
      { x: 4, y: 14 },
      { x: 5, y: 14 },
      { x: 5, y: 15 },
      { x: 6, y: 15 },
    ].map((coord) => ({
      type: 'water',
      x: coord.x,
      y: coord.y,
      imagesKeys: {
        default: ImageKey.WATER_TEXTURE,
        dead: ImageKey.WATER_TEXTURE,
      },
      canOccupiedFields: true,
      isInteractive: false,
    })),

    // 🪨 Głazy
    ...[
      { x: 7, y: 9 },
      { x: 10, y: 10 },
      { x: 14, y: 13 },
      { x: 17, y: 15 },
      { x: 19, y: 18 },
    ].map((coord) => ({
      type: 'rock',
      x: coord.x,
      y: coord.y,
      imagesKeys: { default: ImageKey.BOULDER, dead: ImageKey.BOULDER },
      canOccupiedFields: true,
      isInteractive: false,
    })),
  ],
};

export default gameInstanceData;
