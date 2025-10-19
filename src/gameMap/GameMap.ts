import GameState from '@/gameState/GameState.ts';
import Field from '@/gameMap/field/Field.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { FieldAttributes } from './types.ts';

class GameMap {
  private fields: Field[];

  constructor(fieldsAttributes?: FieldAttributes[]) {
    this.fields = this.generateFields(fieldsAttributes);
  }

  private generateFields(fieldsAttributes: FieldAttributes[]) {
    if (fieldsAttributes) {
      return fieldsAttributes.map(
        (fieldAttributes) => new Field(fieldAttributes)
      );
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
