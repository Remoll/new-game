import Field from '@/gameMap/field/Field.ts';
import Player from '@/gameObject/entity/player/Player.ts';
import { Coordinates } from '@/types.ts';

class GameState {
  private static isDialogueOpen: boolean = false;
  private static player: Player | null = null;
  private static fieldSize: number = 40;
  private static gameMapWidth: number = 21;
  private static gameMapHeight: number = 21;
  private static viewRange: number = 10;
  private static playerAndCenterDifference: Coordinates = { x: null, y: null };
  private static fields: Field[] = [];

  private constructor() {}

  static setIsDialogueOpen(value: boolean): void {
    this.isDialogueOpen = value;
  }

  static getIsDialogueOpen(): boolean {
    return this.isDialogueOpen;
  }

  static setPlayer(player: Player): void {
    this.player = player;
  }

  static getPlayer(): Player {
    return this.player;
  }

  static setFields(fields: Field[]): void {
    this.fields = fields;
  }

  static getFields(): Field[] {
    return this.fields;
  }

  static getFieldFromCoordinates(x: number, y: number): Field | null {
    return (
      this.fields.find(
        (field) => field.getPosition().x === x && field.getPosition().y === y
      ) || null
    );
  }

  static getFieldSize(): number {
    return this.fieldSize;
  }

  static getGameMapWidth(): number {
    return this.gameMapWidth;
  }

  static setGameMapWidth(gameMapWidth: number): void {
    this.gameMapWidth = gameMapWidth;
  }

  static getGameMapHeight(): number {
    return this.gameMapHeight;
  }

  static setGameMapHeight(gameMapHeight: number): void {
    this.gameMapHeight = gameMapHeight;
  }

  static getViewRange(): number {
    return this.viewRange;
  }

  static getPlayerAndCenterDifference(): Coordinates {
    return this.playerAndCenterDifference;
  }

  static setPlayerAndCenterDifference(
    playerAndCenterDifference: Coordinates
  ): void {
    this.playerAndCenterDifference = playerAndCenterDifference;
  }

  static hasLineOfSight(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    opts: { justBlocks?: boolean } = {}
  ): { clear: boolean; checked: [number, number][] } {
    const justBlocks = !!opts.justBlocks;

    const checked: Array<[number, number]> = [];

    let nextX = x1;
    let nextY = y1;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      checked.push([nextX, nextY]);

      if (nextX === x2 && nextY === y2) {
        break;
      }

      if (!(nextX === x1 && nextY === y1)) {
        const field = GameState.getFieldFromCoordinates(nextX, nextY);
        if (!field) {
          return { checked, clear: false };
        }

        const blockingElement = field.getGameObjectThatOccupiedField();

        if (
          blockingElement &&
          (!justBlocks ||
            (justBlocks &&
              (blockingElement?.getType() === 'block' ||
                blockingElement?.getType() === 'door')))
        ) {
          return { checked, clear: false };
        }
      }

      const e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        nextX += sx;
      }
      if (e2 < dx) {
        err += dx;
        nextY += sy;
      }
    }

    return { checked, clear: true };
  }
}

export default GameState;
