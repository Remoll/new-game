import Field from "@/gameMap/field/Field";

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
    const floorColors = ['#0a81e9ff', '#818bd8ff', '#0a6be9ff']
    let index = 0;

    this.fields
      .map((field) => {
        ctx.fillStyle = floorColors[index];

        const { x: fieldX, y: fieldY } = field.getPosition();

        ctx.fillRect(fieldX * 50, fieldY * 50, 50, 50);  // x, y, width, height

        index = index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : null;
      })
  }
}

export default GameMap;
