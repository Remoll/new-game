import Field from "@/gameMap/field/Field";
import ImageManager from "@/imageManager/ImageManager";

class GameMap {
  private fields: Field[];
  private gameMapWidth: number;
  private gameMapHight: number;

  constructor(gameMapWidth, gameMapHight) {
    this.gameMapWidth = gameMapWidth;
    this.gameMapHight = gameMapHight;
    this.fields = this.generateFields();
  }

  private generateFields() {
    const fields = [];

    for (let fieldX = 0; fieldX < this.gameMapWidth; fieldX++) {
      for (let fieldY = 0; fieldY < this.gameMapHight; fieldY++) {

        fields.push(new Field(fieldX, fieldY));

      }
    }

    return fields;
  }

  getFields() {
    return this.fields;
  }

  addToCanvas(ctx: CanvasRenderingContext2D) {
    let index = 0;

    this.fields
      .map((field) => {
        const { x: fieldX, y: fieldY } = field.getPosition();

        ctx.drawImage(ImageManager.instance.getImage("floor"), fieldX * 50, fieldY * 50)

        index = index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : null;
      })
  }
}

export default GameMap;
