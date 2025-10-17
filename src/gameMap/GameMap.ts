import GameState from '@/gameState/GameState.ts';
import Field from '@/gameMap/field/Field.ts';
import { ImageKey } from '@/imageManager/types.ts';

class GameMap {
  private fields: Field[];

  constructor() {
    this.fields = this.generateFields();
  }

  private generateFields() {
    const gameMapWidth: number = GameState.getGameMapWidth();
    const gameMapHeight: number = GameState.getGameMapHeight();
    const fields = [];

    for (let fieldX = 0; fieldX < gameMapWidth; fieldX++) {
      for (let fieldY = 0; fieldY < gameMapHeight; fieldY++) {
        fields.push(new Field(fieldX, fieldY, ImageKey.GROUND_TEXTURE));
      }
    }

    return fields;
  }

  getFields() {
    return this.fields;
  }
}

export default GameMap;
