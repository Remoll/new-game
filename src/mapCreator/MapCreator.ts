import ImageManager from '@/imageManager/ImageManager.ts';
import {
  fieldsLibrary,
  entitiesLibrary,
  blocksLibrary,
  gameObjectsLibrary,
} from './library.ts';
import { Coordinates } from '@/types.ts';
import {
  BlockSprite,
  EntitySprite,
  FieldSprite,
  GameObjectSprite,
  SpriteType,
} from './types.ts';
import { EntityAttributes, GameObjectAttributes } from '@/gameObject/types.ts';
import { GameInstanceData } from '@/gameInstance/types.ts';
import { FieldAttributes } from '@/gameMap/types.ts';

class MapCreator {
  private static singleton: MapCreator | null = null;
  private ctx: CanvasRenderingContext2D;
  private mapSize: Coordinates;
  private fieldSize: number;

  private gameLibraryElement: HTMLElement;
  private fieldsElement: HTMLElement;
  private entitiesElement: HTMLElement;
  private gameObjectsElement: HTMLElement;
  private blocksElement: HTMLElement;
  private clearCursorElement: HTMLElement;
  private selectedSpriteElement: HTMLElement;
  private selectedSpriteImageElement: HTMLElement;
  private removeSelectedSpriteButton: HTMLElement;
  private generateMapFileButton: HTMLElement;

  private mapFields: Record<string, FieldSprite> = {};
  private mapEntities: Record<string, EntitySprite[]> = {};
  private mapGameObjects: Record<string, GameObjectSprite[]> = {};
  private mapBlocks: Record<string, BlockSprite[]> = {};

  private spriteToBePlacedOnTheMap:
    | FieldSprite
    | EntitySprite
    | GameObjectSprite
    | BlockSprite
    | null = null;
  private previouslyClickedCoordinates: Coordinates | null = null;
  private selectedSprite:
    | FieldSprite
    | EntitySprite
    | GameObjectSprite
    | BlockSprite
    | null = null;

  private areaCoordinatedStart: Coordinates | null = null;
  private areaCoordinatedEnd: Coordinates | null = null;

  private constructor(ctx: CanvasRenderingContext2D, mapSize: Coordinates) {
    this.ctx = ctx;
    this.mapSize = mapSize;
    this.gameLibraryElement = document.getElementById('game-library');
    this.fieldsElement = document.getElementById('fields');
    this.entitiesElement = document.getElementById('entities');
    this.gameObjectsElement = document.getElementById('game-objects');
    this.blocksElement = document.getElementById('blocks');
    this.clearCursorElement = document.getElementById('clear-cursor');
    this.selectedSpriteElement = document.getElementById('selected-spike');
    this.selectedSpriteImageElement = document.getElementById(
      'selected-spike-image'
    );
    this.removeSelectedSpriteButton = document.getElementById(
      'remove-selected-sprite'
    );
    this.generateMapFileButton = document.getElementById('generate-map-file');

    this.fieldSize = 840 / (mapSize.x > mapSize.y ? mapSize.x : mapSize.y);
    this.gameLibraryElement.style.display = 'flex';
    this.generateMapFileButton.style.display = 'block';
    this.fillSprites();
    this.handleCanvasClick();
    this.addRemoveSelectedSpriteListener();
    this.addGenerateMapFileListener();
    this.rerenderMap();
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
        delete selectedSpriteObject[coordinatesKey];
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

  private generateMapFile() {
    const parseSpritesObjectToArray = (
      mapGameObjects:
        | Record<string, EntitySprite[]>
        | Record<string, BlockSprite[]>
        | Record<string, FieldSprite>
    ): EntityAttributes[] | GameObjectAttributes[] | FieldAttributes[] => {
      const targetArray:
        | EntityAttributes[]
        | GameObjectAttributes[]
        | FieldAttributes[] = [];

      Object.entries(mapGameObjects).forEach(
        ([coordinatesKey, gameObjects]) => {
          const coordinatesArray = coordinatesKey.split(',');
          const [xString, yString] = coordinatesArray;
          const x = parseInt(xString);
          const y = parseInt(yString);

          if (Array.isArray(gameObjects)) {
            gameObjects.forEach((gameObject) => {
              const { spriteType, ...entityAttributes } = gameObject;
              targetArray.push({ ...entityAttributes, x, y });
            });
          } else {
            const { spriteType, type, ...entityAttributes } = gameObjects;
            targetArray.push({ ...entityAttributes, x, y });
          }
        }
      );

      return targetArray;
    };

    const fields: FieldAttributes[] = parseSpritesObjectToArray(
      this.mapFields
    ) as FieldAttributes[];

    const npcs: EntityAttributes[] = parseSpritesObjectToArray(
      this.mapEntities
    ) as EntityAttributes[];

    const blocks: GameObjectAttributes[] = parseSpritesObjectToArray(
      this.mapBlocks
    ) as GameObjectAttributes[];

    const gameObjects: GameObjectAttributes[] = parseSpritesObjectToArray(
      this.mapBlocks
    ) as GameObjectAttributes[];

    const instanceData: GameInstanceData = {
      mapSize: this.mapSize,
      fields,
      npcs,
      gameObjects,
      blocks,
      items: [],
      gateways: [],
    };

    console.log('instanceData: ', instanceData);

    // 1️⃣ Konwersja obiektu do JSON
    const jsonString = JSON.stringify(instanceData, null, 2); // "ładny" format z wcięciami

    // 2️⃣ Utworzenie obiektu Blob z tekstu JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 3️⃣ Utworzenie tymczasowego adresu URL do pliku
    const url = URL.createObjectURL(blob);

    // 4️⃣ Utworzenie linku <a> i symulacja kliknięcia
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameInstance.json'; // nazwa pliku do pobrania
    a.click();

    // 5️⃣ Zwolnienie pamięci (dobry nawyk)
    URL.revokeObjectURL(url);
  }

  private addGenerateMapFileListener() {
    this.generateMapFileButton.addEventListener('click', () => {
      this.generateMapFile();
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
    sprite: FieldSprite | EntitySprite | GameObjectSprite | BlockSprite | null
  ) {
    this.selectedSprite = sprite;
  }

  private rerenderMap() {
    this.ctx.clearRect(0, 0, 840, 840);
    const imageManager = ImageManager.getSingleton();

    const { x: width, y: height } = this.mapSize;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, width * this.fieldSize, height * this.fieldSize);

    Object.entries(this.mapFields).forEach(([key, mapField]) => {
      const [x, y] = key.split(',');

      this.ctx.drawImage(
        imageManager.getImage(mapField.imageKey),
        parseInt(x) * this.fieldSize,
        parseInt(y) * this.fieldSize,
        this.fieldSize,
        this.fieldSize
      );
    });

    const renderGameObjects = (
      gameObjects: Record<
        string,
        EntitySprite[] | GameObjectSprite[] | BlockSprite[]
      >
    ) => {
      Object.entries(gameObjects).forEach(
        ([key, mapGameObjectOnCoordinates]) => {
          const [x, y] = key.split(',');

          // TODO: establish render line
          mapGameObjectOnCoordinates.forEach((mapGameObject) => {
            this.ctx.drawImage(
              imageManager.getImage(mapGameObject.imagesKeys.default),
              parseInt(x) * this.fieldSize,
              parseInt(y) * this.fieldSize,
              this.fieldSize,
              this.fieldSize
            );
          });
        }
      );
    };

    [this.mapBlocks, this.mapGameObjects, this.mapEntities].forEach(
      (gameObjects) => {
        renderGameObjects(gameObjects);
      }
    );
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
        this.mapFields[coordinatesKey] = { ...this.spriteToBePlacedOnTheMap };
        break;
      }

      case SpriteType.ENTITY: {
        const mapPlaceFromCoordinates = this.mapEntities[coordinatesKey];

        if (mapPlaceFromCoordinates) {
          mapPlaceFromCoordinates.push({
            ...this.spriteToBePlacedOnTheMap,
          });
        } else {
          this.mapEntities[coordinatesKey] = [
            { ...this.spriteToBePlacedOnTheMap },
          ];
        }
        break;
      }

      case SpriteType.GAME_OBJECT: {
        const mapPlaceFromCoordinates = this.mapGameObjects[coordinatesKey];

        if (mapPlaceFromCoordinates) {
          mapPlaceFromCoordinates.push({
            ...this.spriteToBePlacedOnTheMap,
          });
        } else {
          this.mapGameObjects[coordinatesKey] = [
            { ...this.spriteToBePlacedOnTheMap },
          ];
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
          this.mapBlocks[coordinatesKey] = [
            { ...this.spriteToBePlacedOnTheMap },
          ];
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
      // TODO: rewrite select line logic
      let newSprite:
        | FieldSprite
        | EntitySprite
        | GameObjectSprite
        | BlockSprite
        | undefined;

      switch (this.selectedSprite.spriteType) {
        case SpriteType.FIELD: {
          newSprite =
            this.mapEntities[coordinatesKey]?.[0] ||
            this.mapGameObjects[coordinatesKey]?.[0] ||
            this.mapBlocks[coordinatesKey]?.[0];

          break;
        }

        case SpriteType.ENTITY: {
          const indexOfSelectedSprite = this.mapEntities[
            coordinatesKey
          ].findIndex((entitySprite) => entitySprite === this.selectedSprite);
          newSprite =
            this.mapEntities[coordinatesKey][indexOfSelectedSprite + 1] ||
            this.mapGameObjects[coordinatesKey]?.[0] ||
            this.mapBlocks[coordinatesKey]?.[0] ||
            this.mapFields[coordinatesKey] ||
            this.mapEntities[coordinatesKey][0];

          break;
        }
        case SpriteType.BLOCK: {
          const indexOfSelectedSprite = this.mapBlocks[
            coordinatesKey
          ].findIndex((blockSprite) => blockSprite === this.selectedSprite);
          newSprite =
            this.mapBlocks[coordinatesKey][indexOfSelectedSprite + 1] ||
            this.mapFields[coordinatesKey] ||
            this.mapEntities[coordinatesKey]?.[0] ||
            this.mapGameObjects[coordinatesKey]?.[0] ||
            this.mapBlocks[coordinatesKey][0];

          break;
        }
      }

      if (newSprite) {
        this.setSelectedSprite(newSprite);
      }
    } else {
      this.setPreviouslyClickedCoordinates({ x: targetX, y: targetY });
      this.setSelectedSprite(
        this.mapEntities[coordinatesKey]?.[0] ||
          this.mapGameObjects[coordinatesKey]?.[0] ||
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
    sprite: FieldSprite | EntitySprite | GameObjectSprite | BlockSprite
  ) {
    this.spriteToBePlacedOnTheMap = sprite;
  }

  private fillSprites() {
    const imageManager = ImageManager.getSingleton();

    fieldsLibrary.forEach((field) => {
      const fieldElement = document.createElement('li');

      fieldElement.id = `field-${field.type}`;

      const image = new Image();

      image.src = imageManager.getImage(field.imageKey).src;

      fieldElement.appendChild(image);

      fieldElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(field)
      );

      this.fieldsElement.appendChild(fieldElement);
    });

    entitiesLibrary.forEach((entities) => {
      const entitiesElement = document.createElement('li');

      entitiesElement.id = `entities-${entities.type}`;

      const image = new Image();

      image.src = imageManager.getImage(entities.imagesKeys.default).src;

      entitiesElement.appendChild(image);

      entitiesElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(entities)
      );

      this.entitiesElement.appendChild(entitiesElement);
    });

    gameObjectsLibrary.forEach((gameObject) => {
      const gameObjectElement = document.createElement('li');

      gameObjectElement.id = `gameObject-${gameObject.type}`;

      const image = new Image();

      image.src = imageManager.getImage(gameObject.imagesKeys.default).src;

      gameObjectElement.appendChild(image);

      gameObjectElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(gameObject)
      );

      this.gameObjectsElement.appendChild(gameObjectElement);
    });

    blocksLibrary.forEach((block) => {
      const blockElement = document.createElement('li');

      blockElement.id = `block-${block.type}`;

      const image = new Image();

      image.src = imageManager.getImage(block.imagesKeys.default).src;

      blockElement.appendChild(image);

      blockElement.addEventListener('click', () =>
        this.setSpriteToBePlacedOnTheMap(block)
      );

      this.blocksElement.appendChild(blockElement);
    });
  }
}

export default MapCreator;
