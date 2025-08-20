import { IGameMap } from "./types";
import Field from "./field/Field";

class GameMap implements IGameMap {
  fields: Field[];
  constructor() {
    this.fields = this.generateFields();
  }

  generateFields() {
    const map = [];
    const xLength = 50;
    const yLength = 20;
    for (let i = 0; i < xLength; i++) {
      for (let j = 0; j < yLength; j++) {
        map.push(new Field(i, j));
      }
    }
    return map;
  }

  getFields() {
    return this.fields;
  }

  generateHTMLMap() {
    const htmlMap = this.fields
      .map((field) => {
        return field.getHtml();
      })
      .join("");

    return htmlMap;
  }
}

export default GameMap;
