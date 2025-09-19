import { describe, expect, test } from 'vitest'
import GameObject from './GameObject'
import { Direction, GameObjectAttributes } from './types'
import Field from '@/gameMap/field/Field'

const fields = [new Field(0, 0)];

const ganeObjectAttributes: GameObjectAttributes = {
    fields,
    type: "gameObject",
    x: 0,
    y: 0,
    canOccupiedFields: true,
    isInteractive: false,
}

const gameObject: GameObject = new GameObject(ganeObjectAttributes)

describe('findNewCoordinatesFromDirection', () => {
    test("direction up", () => {
        const newCoordinates = gameObject.findNewCoordinatesFromDirection(Direction.UP)
        expect(newCoordinates.x).toBe(0);
        expect(newCoordinates.y).toBe(-1);
    })
    test("direction down", () => {
        const newCoordinates = gameObject.findNewCoordinatesFromDirection(Direction.DOWN)
        expect(newCoordinates.x).toBe(0);
        expect(newCoordinates.y).toBe(1);
    })
    test("direction left", () => {
        const newCoordinates = gameObject.findNewCoordinatesFromDirection(Direction.LEFT)
        expect(newCoordinates.x).toBe(-1);
        expect(newCoordinates.y).toBe(0);
    })
    test("direction right", () => {
        const newCoordinates = gameObject.findNewCoordinatesFromDirection(Direction.RIGHT)
        expect(newCoordinates.x).toBe(1);
        expect(newCoordinates.y).toBe(0);
    })
}) 