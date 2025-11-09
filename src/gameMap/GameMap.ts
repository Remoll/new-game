import GameState from '@/gameState/GameState.ts';
import Field from '@/gameMap/field/Field.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { FieldProps } from './types.ts';

class GameMap {
  private fields: Field[];

  constructor(fieldProps?: FieldProps[]) {
    this.fields = this.generateFields(fieldProps);
  }

  private generateFields(fieldProps: FieldProps[]) {
    if (fieldProps) {
      return fieldProps.map((fieldProps) => new Field(fieldProps));
    }

    const gameMapWidth: number = GameState.getGameMapWidth();
    const gameMapHeight: number = GameState.getGameMapHeight();
    const fields = [];

    for (let fieldX = 0; fieldX < gameMapWidth; fieldX++) {
      for (let fieldY = 0; fieldY < gameMapHeight; fieldY++) {
        fields.push(
          new Field({ x: fieldX, y: fieldY, imageKey: ImageKey.GROUND_TEXTURE })
        );
      }
    }

    return fields;
  }

  getFields() {
    return this.fields;
  }
}

export default GameMap;
