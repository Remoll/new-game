import { beforeEach, describe, expect, test } from 'vitest';
import Entity from './Entity.ts';
import { EntityAttributes, Faction, GameObjectAttributes } from '../types.ts';
import GameMap from '@/gameMap/GameMap.ts';
import Field from '@/gameMap/field/Field.ts';
import Building from '@/gameMap/building/Building.ts';
import { BuildingCoordinates } from '@/gameMap/building/types.ts';
import { Coordinates } from '@/types.ts';
import Block from '../block/Block.ts';
import GameObject from '../GameObject.ts';
import itemFactory from '../item/itemFactory.ts';
import GameState from '@/game/GameState.ts';

describe('findShortestPath', () => {
  const targetCoordinates: Coordinates = { x: 0, y: 2 };
  let gameMap: GameMap;
  let gameFields: Field[];
  let entity: Entity;

  beforeEach(() => {
    // initial map - 3 x 3 fields with block on (0, 1), and path finder on (0, 0)
    GameState.setGameMapWidth(3);
    GameState.setGameMapHeight(3);
    gameMap = new GameMap();
    gameFields = gameMap.getFields();
    GameState.setFields(gameFields);

    const blockAttributes: GameObjectAttributes = {
      type: 'entity',
      x: 0,
      y: 1,
      canOccupiedFields: true,
      isInteractive: false,
      imagesKeys: { default: null, dead: null },
    };

    new Block(blockAttributes);

    const entityAttributes: EntityAttributes = {
      speed: 1,
      type: 'entity',
      x: 0,
      y: 0,
      canOccupiedFields: true,
      isInteractive: false,
      hp: 1,
      faction: Faction.NEUTRAL,
      dispositionToFactions: {},
      imagesKeys: { default: null, dead: null },
    };

    entity = new Entity(entityAttributes);

    const targetGameObjectAttributes: GameObjectAttributes = {
      type: 'gameObject',
      x: targetCoordinates.x,
      y: targetCoordinates.y,
      canOccupiedFields: true,
      isInteractive: false,
      imagesKeys: { default: null, dead: null },
    };

    new GameObject(targetGameObjectAttributes, itemFactory);
  });

  test('go around the wall, but ignore gameObject in target coordinates', () => {
    // additional block on (1, 1) - strict path
    const blockAttributes: GameObjectAttributes = {
      type: 'entity',
      x: 1,
      y: 1,
      canOccupiedFields: true,
      isInteractive: false,
      imagesKeys: { default: null, dead: null },
    };

    new Block(blockAttributes);

    const path = entity.findShortestPath(
      targetCoordinates.x,
      targetCoordinates.y
    );
    const expectedPath = [
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 2],
      [0, 2],
    ];
    expect(expectedPath).toStrictEqual(path);
  });

  test('go around the wall even if there is a entity on path, but ignore gameObject in target coordinates', () => {
    // additional entity on (1, 1) and block on (2, 1) - ignore entity
    const blockAttributes: GameObjectAttributes = {
      type: 'entity',
      x: 2,
      y: 1,
      canOccupiedFields: true,
      isInteractive: false,
      imagesKeys: { default: null, dead: null },
    };

    new Block(blockAttributes);

    const blockingEntityAttributes: EntityAttributes = {
      speed: 1,
      type: 'entity',
      x: 1,
      y: 1,
      canOccupiedFields: true,
      isInteractive: false,
      hp: 1,
      faction: Faction.NEUTRAL,
      dispositionToFactions: {},
      imagesKeys: { default: null, dead: null },
    };

    new Entity(blockingEntityAttributes);

    const path = entity.findShortestPath(
      targetCoordinates.x,
      targetCoordinates.y
    );
    const expectedPath = [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ];
    expect(expectedPath).toStrictEqual(path);
  });

  test('take longer path because of entity that bloking shorter path, but ignore gameObject in target coordinates', () => {
    // additional entity on (1, 1) - take longer, aviable path
    const blockingEntityAttributes: EntityAttributes = {
      speed: 1,
      type: 'entity',
      x: 1,
      y: 1,
      canOccupiedFields: true,
      isInteractive: false,
      hp: 1,
      faction: Faction.NEUTRAL,
      dispositionToFactions: {},
      imagesKeys: { default: null, dead: null },
    };

    new Entity(blockingEntityAttributes);

    const path = entity.findShortestPath(
      targetCoordinates.x,
      targetCoordinates.y
    );
    const expectedPath = [
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 2],
      [0, 2],
    ];
    expect(expectedPath).toStrictEqual(path);
  });

  test('return null if no path exist', () => {
    // additional blocks on (1, 1) and (2, 1) - no patch
    const buildingCoordinates: BuildingCoordinates = {
      topLeft: { x: 1, y: 1 },
      bottomRight: { x: 2, y: 1 },
      doors: null,
    };

    new Building(buildingCoordinates);

    const path = entity.findShortestPath(
      targetCoordinates.x,
      targetCoordinates.y
    );
    expect(null).toStrictEqual(path);
  });
});
