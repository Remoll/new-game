import { beforeEach, describe, expect, test } from 'vitest'
import Entity from './Entity'
import { EntityAttributes, Faction, GameObjectAttributes } from '../types'
import GameMap from '@/gameMap/GameMap'
import Field from '@/gameMap/field/Field';
import Building from '@/gameMap/building/Building';
import { BuildingCoordinates } from '@/gameMap/building/types';
import { Coordinates } from '@/types';
import Block from '../block/Block';
import GameObject from '../GameObject';

describe('findShortestPath', () => {
    const targetCoordinates: Coordinates = { x: 0, y: 2 };
    let gameMap: GameMap;
    let gameFields: Field[];
    let entity: Entity;

    beforeEach(() => {
        // initial map - 3 x 3 fields with block on (0, 1), and path finder on (0, 0)
        gameMap = new GameMap(3, 3);

        gameFields = gameMap.getFields();

        const blockAttributes: GameObjectAttributes = {
            fields: gameFields,
            type: "entity",
            x: 0,
            y: 1,
            canOccupiedFields: true,
            isInteractive: false,
        }

        new Block(blockAttributes)

        const entityAttributes: EntityAttributes = {
            fields: gameFields,
            type: "entity",
            x: 0,
            y: 0,
            canOccupiedFields: true,
            isInteractive: false,
            hp: 1,
            faction: Faction.NEUTRAL,
            dispositionToFactions: {},
        }

        entity = new Entity(entityAttributes);

        const targetGameObjectAttributes: GameObjectAttributes = {
            fields: gameFields,
            type: "gameObject",
            x: targetCoordinates.x,
            y: targetCoordinates.y,
            canOccupiedFields: true,
            isInteractive: false,
        }

        new GameObject(targetGameObjectAttributes);
    });

    test("go around the wall, but ignore gameObject in target coordinates", () => {
        // additional block on (1, 1) - strict path
        const blockAttributes: GameObjectAttributes = {
            fields: gameFields,
            type: "entity",
            x: 1,
            y: 1,
            canOccupiedFields: true,
            isInteractive: false,
        }

        new Block(blockAttributes)

        const path = entity.findShortestPath(targetCoordinates.x, targetCoordinates.y);
        const expectedPath = [[1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2]]
        expect(expectedPath).toStrictEqual(path);
    })

    test("go around the wall even if there is a entity on path, but ignore gameObject in target coordinates", () => {
        // additional entity on (1, 1) and block on (2, 1) - ignore entity
        const blockAttributes: GameObjectAttributes = {
            fields: gameFields,
            type: "entity",
            x: 2,
            y: 1,
            canOccupiedFields: true,
            isInteractive: false,
        }

        new Block(blockAttributes)

        const blockingEntityAttributes: EntityAttributes = {
            fields: gameFields,
            type: "entity",
            x: 1,
            y: 1,
            canOccupiedFields: true,
            isInteractive: false,
            hp: 1,
            faction: Faction.NEUTRAL,
            dispositionToFactions: {},
        }

        new Entity(blockingEntityAttributes)

        const path = entity.findShortestPath(targetCoordinates.x, targetCoordinates.y);
        const expectedPath = [[1, 0], [1, 1], [1, 2], [0, 2]]
        expect(expectedPath).toStrictEqual(path);
    })

    test("take longer path because of entity that bloking shorter path, but ignore gameObject in target coordinates", () => {
        // additional entity on (1, 1) - take longer, aviable path
        const blockingEntityAttributes: EntityAttributes = {
            fields: gameFields,
            type: "entity",
            x: 1,
            y: 1,
            canOccupiedFields: true,
            isInteractive: false,
            hp: 1,
            faction: Faction.NEUTRAL,
            dispositionToFactions: {},
        }

        new Entity(blockingEntityAttributes)

        const path = entity.findShortestPath(targetCoordinates.x, targetCoordinates.y);
        const expectedPath = [[1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2]]
        expect(expectedPath).toStrictEqual(path);
    })

    test("return null if no path exist", () => {
        // additional blocks on (1, 1) and (2, 1) - no patch
        const buildingCoordinates: BuildingCoordinates = {
            topLeft: { x: 1, y: 1 },
            bottomRight: { x: 2, y: 1 },
            door: null,
        };

        new Building(gameFields, buildingCoordinates);

        const path = entity.findShortestPath(targetCoordinates.x, targetCoordinates.y);
        expect(null).toStrictEqual(path);
    })
}) 