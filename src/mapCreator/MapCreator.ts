import ImageManager from '@/imageManager/ImageManager.ts';
import { fieldsLibrary, entitiesLibrary, blocksLibrary } from './library.ts';
import { Coordinates } from '@/types.ts';
import { BlockSprite, EntitySprite, FieldSprite, SpriteType } from './types.ts';

class MapCreator {
  private static singleton: MapCreator | null = null;
  private ctx: CanvasRenderingContext2D;
  private mapSize: Coordinates;
  private fieldSize: number;

  private gameLibraryElement: HTMLElement;
  private fieldsElement: HTMLElement;
  private entitiesElement: HTMLElement;
  private blocksElement: HTMLElement;
  private clearCursorElement: HTMLElement;
  private selectedSpriteElement: HTMLElement;
  private selectedSpriteImageElement: HTMLElement;
  private removeSelectedSpriteButton: HTMLElement;

  private mapFields: Record<string, FieldSprite> = {};
  private mapEntities: Record<string, EntitySprite[]> = {};
  private mapBlocks: Record<string, BlockSprite[]> = {};

  private spriteToBePlacedOnTheMap:
    | FieldSprite
    | EntitySprite
    | BlockSprite
    | null = null;
  private previouslyClickedCoordinates: Coordinates | null = null;
  private selectedSprite: FieldSprite | EntitySprite | BlockSprite | null =
    null;

  private areaCoordinatedStart: Coordinates | null = null;
  private areaCoordinatedEnd: Coordinates | null = null;

  private constructor(ctx: CanvasRenderingContext2D, mapSize: Coordinates) {
    this.ctx = ctx;
    this.mapSize = mapSize;
    this.gameLibraryElement = document.getElementById('game-library');
    this.fieldsElement = document.getElementById('fields');
    this.entitiesElement = document.getElementById('entities');
    this.blocksElement = document.getElementById('blocks');
    this.clearCursorElement = document.getElementById('clear-cursor');
    this.selectedSpriteElement = document.getElementById('selected-spike');
    this.selectedSpriteImageElement = document.getElementById(
      'selected-spike-image'
    );
    this.removeSelectedSpriteButton = document.getElementById(
      'remove-selected-sprite'
    );

    this.fieldSize = 840 / (mapSize.x > mapSize.y ? mapSize.x : mapSize.y);
    this.gameLibraryElement.style.display = 'flex';
    this.fillSprites();
    this.handleCanvasClick();
    this.addRemoveSelectedSpriteListener();
  }

  private removeSelectedSpriteFromMap() {
    if (!this.selectedSprite) {
      return;
    }

    if (!this.previouslyClickedCoordinates) {
      throw new Error(
        'this.previouslyClickedCoordinates not set for this.selectedSprite'
      );
    }

    let selectedSpriteObject;

    switch (this.selectedSprite.spriteType) {
      case SpriteType.FIELD: {
        selectedSpriteObject = this.mapFields;
        break;
      }

      case SpriteType.ENTITY: {
        selectedSpriteObject = this.mapEntities;
        break;
      }

      case SpriteType.BLOCK: {
        selectedSpriteObject = this.mapBlocks;
        break;
      }

      default:
        break;
    }

    const { x, y } = this.previouslyClickedCoordinates;

    const coordinatesKey = `${x},${y}`;

    switch (this.selectedSprite.spriteType) {
      case SpriteType.FIELD: {
        selectedSpriteObject[coordinatesKey] = null;
        break;
      }

      case SpriteType.ENTITY:
      case SpriteType.BLOCK: {
        const spriteIndex = selectedSpriteObject[coordinatesKey].findIndex(
          (sprite) => sprite === this.selectedSprite
        );

        if (spriteIndex === undefined || spriteIndex < 0) {
          throw new Error('spriteIndex for removing sprite not exist');
        }

        selectedSpriteObject[coordinatesKey].splice(spriteIndex, 1);
        break;
      }

      default: {
        throw new Error('invalid spriteType during remove');
      }
    }

    this.setSelectedSprite(null);
    this.closeSelectedSpriteWindow();
    this.rerenderMap();
  }

  private addRemoveSelectedSpriteListener() {
    this.removeSelectedSpriteButton.addEventListener('click', () => {
      this.removeSelectedSpriteFromMap();
    });
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

  private setAreaCoordinatesStart(coordinates: Coordinates) {
    this.areaCoordinatedStart = coordinates;
  }

  private getAreaCoordinatesStart(): Coordinates | null {
    return this.areaCoordinatedStart;
  }

  private setAreaCoordinatesEnd(coordinates: Coordinates) {
    this.areaCoordinatedEnd = coordinates;
  }

  private getAreaCoordinatesEnd(): Coordinates | null {
    return this.areaCoordinatedEnd;
  }

  private setPreviouslyClickedCoordinates(coordinates: Coordinates) {
    this.previouslyClickedCoordinates = coordinates;
  }

  private setSelectedSprite(
    sprite: FieldSprite | EntitySprite | BlockSprite | null
  ) {
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

    const renderGameObjects = (
      gameObjects: Record<string, EntitySprite[] | BlockSprite[]>
    ) => {
      Object.entries(gameObjects).forEach(
        ([key, mapGameObjectOnCoordinates]) => {
          const [x, y] = key.split(',');

          // TODO: establish render line
          mapGameObjectOnCoordinates.forEach((mapGameObject) => {
            this.ctx.drawImage(
              ImageManager.getSingleton().getImage(
                mapGameObject.imagesKeys.default
              ),
              parseInt(x) * this.fieldSize,
              parseInt(y) * this.fieldSize,
              this.fieldSize,
              this.fieldSize
            );
          });
        }
      );
    };

    [this.mapBlocks, this.mapEntities].forEach((gameObjects) => {
      renderGameObjects(gameObjects);
    });
  }

  private getMouseCoordinatesFromCanvas(event: MouseEvent): Coordinates | null {
    if ((event.target as HTMLElement).id !== 'canvas') {
      return null;
    }

    const { left, top } = (event.target as HTMLElement).getBoundingClientRect();

    const canvasMousePosition = {
      x: event.clientX - left,
      y: event.clientY - top,
    };

    const targetX = Math.floor(canvasMousePosition.x / this.fieldSize);

    const targetY = Math.floor(canvasMousePosition.y / this.fieldSize);

    if (targetX > this.mapSize.x - 1 || targetY > this.mapSize.y - 1) {
      return null;
    }

    return { x: targetX, y: targetY };
  }

  private placeSpriteOnTheMap(coordinates: Coordinates) {
    const coordinatesKey = `${coordinates.x},${coordinates.y}`;
    const spriteType = this.spriteToBePlacedOnTheMap.spriteType;

    switch (spriteType) {
      case SpriteType.FIELD: {
        this.mapFields[coordinatesKey] = this.spriteToBePlacedOnTheMap;
        break;
      }

      case SpriteType.ENTITY: {
        const mapPlaceFromCoordinates = this.mapEntities[coordinatesKey];

        if (mapPlaceFromCoordinates) {
          mapPlaceFromCoordinates.push({
            ...this.spriteToBePlacedOnTheMap,
          });
        } else {
          this.mapEntities[coordinatesKey] = [this.spriteToBePlacedOnTheMap];
        }
        break;
      }

      case SpriteType.BLOCK: {
        const mapPlaceFromCoordinates = this.mapBlocks[coordinatesKey];

        if (mapPlaceFromCoordinates) {
          mapPlaceFromCoordinates.push({
            ...this.spriteToBePlacedOnTheMap,
          });
        } else {
          this.mapBlocks[coordinatesKey] = [this.spriteToBePlacedOnTheMap];
        }
        break;
      }

      default:
        break;
    }

    this.rerenderMap();
  }

  private setImageFormSelectedSpriteWindow() {
    if (!this.selectedSprite) {
      return;
    }

    let image;

    const imageManager = ImageManager.getSingleton();

    switch (this.selectedSprite.spriteType) {
      case SpriteType.FIELD: {
        image = imageManager.getImage(this.selectedSprite.imageKey);
        break;
      }

      case SpriteType.ENTITY:
      case SpriteType.BLOCK: {
        image = imageManager.getImage(this.selectedSprite.imagesKeys.default);
        break;
      }

      default:
        break;
    }

    this.selectedSpriteImageElement.innerHTML = '';
    this.selectedSpriteImageElement.appendChild(image);
  }

  private openSelectedSpriteWindow() {
    if (!this.selectedSprite) {
      return;
    }
    this.setImageFormSelectedSpriteWindow();
    this.selectedSpriteElement.style.display = 'block';
  }

  private closeSelectedSpriteWindow() {
    this.selectedSpriteImageElement.innerHTML = '';
    this.selectedSpriteElement.style.display = 'none';
  }

  private selectSpriteFromCoordinates(coordinates: Coordinates) {
    const { x: targetX, y: targetY } = coordinates;
    const coordinatesKey = `${targetX},${targetY}`;

    if (
      this.selectedSprite &&
      this.previouslyClickedCoordinates &&
      this.previouslyClickedCoordinates.x === targetX &&
      this.previouslyClickedCoordinates.y === targetY
    ) {
      switch (this.selectedSprite.spriteType) {
        case SpriteType.FIELD: {
          if (this.mapEntities[coordinatesKey]?.[0]) {
            this.setSelectedSprite(this.mapEntities[coordinatesKey][0]);
          }
          break;
        }
        // TODO: rewrite select line logic
        case SpriteType.ENTITY: {
          const indexOfSelectedSprite = this.mapEntities[
            coordinatesKey
          ].findIndex((entitySprite) => entitySprite === this.selectedSprite);
          const newSprite =
            this.mapEntities[coordinatesKey][indexOfSelectedSprite + 1] ||
            this.mapBlocks[coordinatesKey]?.[0] ||
            this.mapFields[coordinatesKey] ||
            this.mapEntities[coordinatesKey][0];

          if (newSprite) {
            this.setSelectedSprite(newSprite);
          }
          break;
        }
        case SpriteType.BLOCK: {
          const indexOfSelectedSprite = this.mapBlocks[
            coordinatesKey
          ].findIndex((blockSprite) => blockSprite === this.selectedSprite);
          const newSprite =
            this.mapBlocks[coordinatesKey][indexOfSelectedSprite + 1] ||
            this.mapFields[coordinatesKey] ||
            this.mapEntities[coordinatesKey]?.[0] ||
            this.mapBlocks[coordinatesKey][0];

          if (newSprite) {
            this.setSelectedSprite(newSprite);
          }
          break;
        }
      }
    } else {
      this.setPreviouslyClickedCoordinates({ x: targetX, y: targetY });
      this.setSelectedSprite(
        this.mapEntities[coordinatesKey]?.[0] ||
          this.mapBlocks[coordinatesKey]?.[0] ||
          this.mapFields[coordinatesKey] ||
          null
      );
    }

    if (this.selectedSprite) {
      this.openSelectedSpriteWindow();
    } else {
      this.closeSelectedSpriteWindow();
    }
  }

  private drawArea() {
    const startCoords = this.getAreaCoordinatesStart();
    const endCoords = this.getAreaCoordinatesEnd();

    const start = {
      x: Math.min(startCoords.x, endCoords.x),
      y: Math.min(startCoords.y, endCoords.y),
    };

    const end = {
      x: Math.max(startCoords.x, endCoords.x),
      y: Math.max(startCoords.y, endCoords.y),
    };

    for (let fieldX = start.x; fieldX <= end.x; fieldX++) {
      for (let fieldY = start.y; fieldY <= end.y; fieldY++) {
        this.placeSpriteOnTheMap({ x: fieldX, y: fieldY });
      }
    }
  }

  private handleCanvasClick() {
    const handleEndAreaDraw = (event: MouseEvent) => {
      document.removeEventListener('mouseup', handleEndAreaDraw);

      this.setAreaCoordinatesEnd(this.getMouseCoordinatesFromCanvas(event));

      if (!this.getAreaCoordinatesEnd()) {
        return;
      }

      this.drawArea();
    };

    document.addEventListener('mousedown', (event: MouseEvent) => {
      if (!this.spriteToBePlacedOnTheMap) {
        return;
      }

      this.setAreaCoordinatesStart(this.getMouseCoordinatesFromCanvas(event));

      if (!this.getAreaCoordinatesStart()) {
        return;
      }

      document.addEventListener('mouseup', handleEndAreaDraw);
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const coordinatesFromCanvas = this.getMouseCoordinatesFromCanvas(event);

      if (!coordinatesFromCanvas) {
        return;
      }

      if (!this.spriteToBePlacedOnTheMap) {
        this.selectSpriteFromCoordinates(coordinatesFromCanvas);
      }
    });

    this.clearCursorElement.addEventListener('click', () => {
      this.spriteToBePlacedOnTheMap = null;
    });
  }

  private setSpriteToBePlacedOnTheMap(
    sprite: FieldSprite | EntitySprite | BlockSprite
  ) {
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

    entitiesLibrary.forEach((gameObject) => {
      const gameObjectElement = document.createElement('li');

      gameObjectElement.id = `gameObject-${gameObject.type}`;

      const image = ImageManager.getSingleton().getImage(
        gameObject.imagesKeys.default
      );

      gameObjectElement.appendChild(image);

      gameObjectElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(gameObject)
      );

      this.entitiesElement.appendChild(gameObjectElement);
    });

    blocksLibrary.forEach((block) => {
      const blockElement = document.createElement('li');

      blockElement.id = `block-${block.type}`;

      const image = ImageManager.getSingleton().getImage(
        block.imagesKeys.default
      );

      blockElement.appendChild(image);

      blockElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(block)
      );

      this.blocksElement.appendChild(blockElement);
    });
  }
}

export default MapCreator;
