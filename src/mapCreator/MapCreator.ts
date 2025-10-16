import ImageManager from '@/imageManager/ImageManager.ts';
import { fieldsLibrary, gameObjectsLibrary } from './library.ts';
import { Coordinates } from '@/types.ts';
import { GameSprite, SpriteType } from './types.ts';

class MapCreator {
  private static singleton: MapCreator | null = null;
  private ctx: CanvasRenderingContext2D;
  private mapSize: Coordinates;
  private gameLibraryElement: HTMLElement;
  private fieldsElement: HTMLElement;
  private gameObjectsElement: HTMLElement;
  private clearCursorElement: HTMLElement;
  private fieldSize: number;
  private spriteToBePlacedOnTheMap: GameSprite | null = null;
  private mapFields: Record<string, GameSprite> = {};
  private mapGameObjects: Record<string, GameSprite[]> = {};
  private previouslyClickedCoordinates: Coordinates | null = null;
  private selectedSprite: GameSprite | null = null;

  private constructor(ctx: CanvasRenderingContext2D, mapSize: Coordinates) {
    this.ctx = ctx;
    this.mapSize = mapSize;
    this.gameLibraryElement = document.getElementById('game-library');
    this.fieldsElement = document.getElementById('fields');
    this.gameObjectsElement = document.getElementById('game-objects');
    this.clearCursorElement = document.getElementById('clear-cursor');
    this.fieldSize = 840 / (mapSize.x > mapSize.y ? mapSize.x : mapSize.y);
    this.gameLibraryElement.style.display = 'flex';
    this.fillSprites();
    this.handleCanvasClick();
  }

  static getSingleton(
    ctx?: CanvasRenderingContext2D,
    mapSize?: Coordinates
  ): MapCreator {
    if (!MapCreator.singleton && ctx && mapSize) {
      MapCreator.singleton = new MapCreator(ctx, mapSize);
    }
    return MapCreator.singleton;
  }

  private setPreviouslyClickedCoordinates(coordinates: Coordinates) {
    this.previouslyClickedCoordinates = coordinates;
  }

  private setSelectedSprite(sprite: GameSprite) {
    this.selectedSprite = sprite;
  }

  private rerenderMap() {
    this.ctx.clearRect(0, 0, 840, 840);

    Object.entries(this.mapFields).forEach(([key, mapField]) => {
      const [x, y] = key.split(',');

      this.ctx.drawImage(
        ImageManager.getSingleton().getImage(mapField.imageKey),
        parseInt(x) * this.fieldSize,
        parseInt(y) * this.fieldSize,
        this.fieldSize,
        this.fieldSize
      );
    });

    Object.entries(this.mapGameObjects).forEach(
      ([key, mapGameObjectsOnCoordinates]) => {
        const [x, y] = key.split(',');

        // TODO: establish render line
        mapGameObjectsOnCoordinates.forEach((mapGameObject) => {
          this.ctx.drawImage(
            ImageManager.getSingleton().getImage(mapGameObject.imageKey),
            parseInt(x) * this.fieldSize,
            parseInt(y) * this.fieldSize,
            this.fieldSize,
            this.fieldSize
          );
        });
      }
    );
  }

  private getCoordinatesFromCanvasClick(
    event: PointerEvent
  ): Coordinates | null {
    if ((event.target as HTMLElement).id !== 'canvas') {
      return null;
    }
    const { left, top } = (event.target as HTMLElement).getBoundingClientRect();
    return {
      x: event.clientX - left,
      y: event.clientY - top,
    };
  }

  private placeSpriteOnTheMap(coordinates: Coordinates) {
    const coordinatesKey = `${coordinates.x},${coordinates.y}`;
    const spriteType = this.spriteToBePlacedOnTheMap.spriteType;

    switch (spriteType) {
      case SpriteType.FIELD: {
        this.mapFields[coordinatesKey] = this.spriteToBePlacedOnTheMap;
        break;
      }

      case SpriteType.GAME_OBJECT: {
        const mapPlaceFromCoordinates = this.mapGameObjects[coordinatesKey];

        if (mapPlaceFromCoordinates) {
          mapPlaceFromCoordinates.push({
            ...this.spriteToBePlacedOnTheMap,
          });
        } else {
          this.mapGameObjects[coordinatesKey] = [this.spriteToBePlacedOnTheMap];
        }
        break;
      }

      default:
        break;
    }

    this.rerenderMap();
  }

  private selectSpriteFromCoordinates(coordinates: Coordinates) {
    const { x: targetX, y: targetY } = coordinates;
    const coordinatesKey = `${targetX},${targetY}`;

    if (
      this.previouslyClickedCoordinates &&
      this.previouslyClickedCoordinates.x === targetX &&
      this.previouslyClickedCoordinates.y === targetY
    ) {
      switch (this.selectedSprite.spriteType) {
        case SpriteType.FIELD: {
          if (this.mapGameObjects[coordinatesKey]?.[0]) {
            this.setSelectedSprite(this.mapGameObjects[coordinatesKey][0]);
          }
          break;
        }
        case SpriteType.GAME_OBJECT: {
          const indexOfSelectedSprite = this.mapGameObjects[
            coordinatesKey
          ].findIndex(
            (gameObjectSprite) => gameObjectSprite === this.selectedSprite
          );
          const newSprite =
            this.mapGameObjects[coordinatesKey][indexOfSelectedSprite + 1] ||
            this.mapFields[coordinatesKey] ||
            this.mapGameObjects[coordinatesKey][0];

          if (newSprite) {
            this.setSelectedSprite(newSprite);
          }
          break;
        }
      }
    } else {
      this.setPreviouslyClickedCoordinates({ x: targetX, y: targetY });
      this.setSelectedSprite(
        this.mapGameObjects[coordinatesKey]?.[0] ||
          this.mapFields[coordinatesKey] ||
          null
      );
    }
  }

  private handleCanvasClick() {
    document.addEventListener('click', (event: PointerEvent) => {
      const coordinatesFromCanvasClick: Coordinates =
        this.getCoordinatesFromCanvasClick(event);

      if (!coordinatesFromCanvasClick) {
        return;
      }

      const targetX = Math.floor(coordinatesFromCanvasClick.x / this.fieldSize);

      const targetY = Math.floor(coordinatesFromCanvasClick.y / this.fieldSize);

      if (targetX > this.mapSize.x - 1 || targetY > this.mapSize.y - 1) {
        return;
      }

      const coordinates = { x: targetX, y: targetY };

      if (this.spriteToBePlacedOnTheMap) {
        this.placeSpriteOnTheMap(coordinates);
      } else {
        this.selectSpriteFromCoordinates(coordinates);
      }
    });

    this.clearCursorElement.addEventListener('click', () => {
      this.spriteToBePlacedOnTheMap = null;
    });
  }

  private setSpriteToBePlacedOnTheMap(sprite: GameSprite) {
    this.spriteToBePlacedOnTheMap = sprite;
  }

  private fillSprites() {
    fieldsLibrary.forEach((field) => {
      const fieldElement = document.createElement('li');

      fieldElement.id = `field-${field.type}`;

      const image = ImageManager.getSingleton().getImage(field.imageKey);

      fieldElement.appendChild(image);

      fieldElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(field)
      );

      this.fieldsElement.appendChild(fieldElement);
    });

    gameObjectsLibrary.forEach((gameObject) => {
      const gameObjectElement = document.createElement('li');

      gameObjectElement.id = `gameObject-${gameObject.type}`;

      const image = ImageManager.getSingleton().getImage(gameObject.imageKey);

      gameObjectElement.appendChild(image);

      gameObjectElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(gameObject)
      );

      this.gameObjectsElement.appendChild(gameObjectElement);
    });
  }
}

export default MapCreator;
