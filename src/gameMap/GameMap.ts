import { IGameMap } from "./types";
import Field from "./field/Field";

class GameMap implements IGameMap {
  fields: Field[];
  constructor() {
    this.fields = this.generateFields();
  }

  generateFields() {
    const gameMapWidth = 20;
    const gameMapHight = 20;

    const fields = [];

    for (let fieldX = 0; fieldX < gameMapWidth; fieldX++) {
      for (let fieldY = 0; fieldY < gameMapHight; fieldY++) {

        fields.push(new Field(fieldX, fieldY));

      }
    }

    return fields;
  }

  getFields() {
    return this.fields;
  }

  addToCanvas(ctx) {
    const floorColors = ['#0a81e9ff', '#818bd8ff', '#0a6be9ff']
    let index = 0;

    this.fields
      .map((field) => {
        ctx.fillStyle = floorColors[index];

        ctx.fillRect(field.x * 50, field.y * 50, 50, 50);  // x, y, width, height

        index = index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : null;
      })
  }
}

export default GameMap;
