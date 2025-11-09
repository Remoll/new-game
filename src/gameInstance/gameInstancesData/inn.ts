import { Disposition, Faction } from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';
import { DialogueKey } from '@/dialogueManager/types.ts';
import { Coordinates } from '@/types.ts';

const fieldsCoordinates = () => {
  const coordinates: Coordinates[] = [];
  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 7; y++) {
      coordinates.push({ x, y });
    }
  }

  return coordinates;
};

const gameInstanceData: GameInstanceData = {
  mapSize: {
    x: 20,
    y: 7,
  },
  fields: [
    ...fieldsCoordinates().map((coordinates) => ({
      x: coordinates.x,
      y: coordinates.y,
      imageKey: ImageKey.WOOD_TEXTURE,
    })),
  ],
  buildingsCoordinates: [
    {
      topLeft: {
        x: 0,
        y: 0,
      },
      bottomRight: {
        x: 19,
        y: 0,
      },
      doors: null,
    },
    {
      topLeft: {
        x: 0,
        y: 6,
      },
      bottomRight: {
        x: 19,
        y: 6,
      },
      doors: null,
    },
    {
      topLeft: {
        x: 0,
        y: 1,
      },
      bottomRight: {
        x: 0,
        y: 5,
      },
      doors: null,
    },
    {
      topLeft: {
        x: 19,
        y: 1,
      },
      bottomRight: {
        x: 19,
        y: 4,
      },
      doors: null,
    },
  ],
  npcs: [
    {
      speed: 1,
      type: 'innkeeper',
      x: 2,
      y: 2,
      imagesKeys: { default: ImageKey.INNKEEPER, dead: ImageKey.INNKEEPER },
      faction: Faction.NEUTRAL,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: true,
      dialogueKey: DialogueKey.INNKEEPER,
    },
    {
      speed: 1,
      type: 'npc',
      x: 16,
      y: 2,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.NEUTRAL,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'npc',
      x: 12,
      y: 3,
      imagesKeys: { default: ImageKey.VILLAGER, dead: ImageKey.VILLAGER_DEAD },
      faction: Faction.NEUTRAL,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'npc',
      x: 7,
      y: 1,
      imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
      faction: Faction.NEUTRAL,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 1,
      type: 'npc',
      x: 9,
      y: 4,
      imagesKeys: { default: ImageKey.VILLAGER, dead: ImageKey.VILLAGER_DEAD },
      faction: Faction.NEUTRAL,
      hp: 100,
      defaultDamageValue: 10,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      speed: 3,
      type: 'dog',
      x: 18,
      y: 2,
      imagesKeys: { default: ImageKey.DOG, dead: ImageKey.DOG_DEAD },
      faction: Faction.NEUTRAL,
      hp: 150,
      defaultDamageValue: 20,
      dispositionToFactions: {
        [Disposition.HOSTILE]: [Faction.ENEMY],
        [Disposition.FRIENDLY]: [Faction.NEUTRAL],
        [Disposition.NEUTRAL]: [Faction.PLAYER],
      },
      canOccupiedFields: true,
      isInteractive: false,
    },
  ],
  items: [],
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.ROAD_TO_THE_FOREST,
      type: 'gateway',
      x: 19,
      y: 5,
      targetPlayerCoordinates: { x: 0, y: 1 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
  workshops: [],
  chests: [
    {
      itemsProps: [
        {
          type: 'fireWand',
          x: null,
          y: null,
          imagesKeys: { default: ImageKey.WAND, dead: ImageKey.WAND },
          canOccupiedFields: false,
          isInteractive: true,
        },
      ],
      type: 'chest',
      x: 1,
      y: 1,
      imagesKeys: { default: ImageKey.CHEST, dead: ImageKey.CHEST },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
  gameObjects: [
    {
      type: 'table',
      x: 3,
      y: 1,
      sizeX: 1,
      sizeY: 3,
      imagesKeys: { default: ImageKey.TABLE, dead: ImageKey.TABLE },
      canOccupiedFields: true,
      isInteractive: false,
    },

    {
      type: 'table',
      x: 7,
      y: 2,
      sizeX: 3,
      sizeY: 2,
      imagesKeys: { default: ImageKey.TABLE, dead: ImageKey.TABLE },
      canOccupiedFields: true,
      isInteractive: false,
    },

    {
      type: 'stool',
      x: 7,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 8,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 9,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 7,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 8,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 9,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 6,
      y: 2,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 6,
      y: 3,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 10,
      y: 2,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 10,
      y: 3,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },

    {
      type: 'table',
      x: 13,
      y: 2,
      sizeX: 3,
      sizeY: 2,
      imagesKeys: { default: ImageKey.TABLE, dead: ImageKey.TABLE },
      canOccupiedFields: true,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 13,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 14,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 15,
      y: 1,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 13,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 14,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 15,
      y: 4,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 12,
      y: 2,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 12,
      y: 3,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 16,
      y: 2,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
    {
      type: 'stool',
      x: 16,
      y: 3,
      imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
      canOccupiedFields: false,
      isInteractive: false,
    },
  ],
};

export default gameInstanceData;
