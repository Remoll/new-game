import { describe, expect, test } from 'vitest';
import GameObject from './GameObject.ts';
import { Direction, GameObjectAttributes } from './types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import itemFactory from './item/itemFactory.ts';

const ganeObjectAttributes: GameObjectAttributes = {
  type: 'gameObject',
  x: 0,
  y: 0,
  canOccupiedFields: true,
  isInteractive: false,
  imagesKeys: { default: ImageKey.DOG, dead: ImageKey.DOG },
};

const gameObject: GameObject = new GameObject(
  ganeObjectAttributes,
  itemFactory
);

describe('findNewCoordinatesFromDirection', () => {
  test('direction up', () => {
    const newCoordinates = gameObject.findNewCoordinatesFromDirection(
      Direction.UP
    );
    expect(newCoordinates.x).toBe(0);
    expect(newCoordinates.y).toBe(-1);
  });
  test('direction down', () => {
    const newCoordinates = gameObject.findNewCoordinatesFromDirection(
      Direction.DOWN
    );
    expect(newCoordinates.x).toBe(0);
    expect(newCoordinates.y).toBe(1);
  });
  test('direction left', () => {
    const newCoordinates = gameObject.findNewCoordinatesFromDirection(
      Direction.LEFT
    );
    expect(newCoordinates.x).toBe(-1);
    expect(newCoordinates.y).toBe(0);
  });
  test('direction right', () => {
    const newCoordinates = gameObject.findNewCoordinatesFromDirection(
      Direction.RIGHT
    );
    expect(newCoordinates.x).toBe(1);
    expect(newCoordinates.y).toBe(0);
  });
});
