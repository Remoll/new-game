import Field from "gameMap/field/Field";
import Block from "./Block";

class Building {
    blocks: Block[];
    fields: Field[];
    oppositeCornersCoordinates: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 }
    }

    constructor(fields, oppositeCornersCoordinates) {
        this.fields = fields;
        this.oppositeCornersCoordinates = oppositeCornersCoordinates;
        this.generateBlocks();
    }

    generateBlocks() {
        const start = this.oppositeCornersCoordinates.topLeft;
        const end = this.oppositeCornersCoordinates.bottomRight;

        const fieldsCoordinates = [];

        for (let fieldX = start.x; fieldX <= end.x; fieldX++) {
            const isVericalWall = fieldX === start.x || fieldX === end.x;

            if (isVericalWall) {
                // Create vertical wall
                for (let fieldY = start.y; fieldY <= end.y; fieldY++) {
                    fieldsCoordinates.push({ x: fieldX, y: fieldY })
                }
            } else {
                // Create opposite Y blocks
                fieldsCoordinates.push({ x: fieldX, y: start.y })
                fieldsCoordinates.push({ x: fieldX, y: end.y })
            }
        }

        this.blocks = fieldsCoordinates.map((fieldCoordinates) => new Block(this.fields, fieldCoordinates.x, fieldCoordinates.y))
    }

    getBlocks() {
        return this.blocks;
    }
}

export default Building;
