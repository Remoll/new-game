import Field from "gameMap/field/Field";
import Block from "./Block";
import Door from "./Door";

class Building {
    blocks: Block[];
    fields: Field[];
    coordinates: {
        topLeft: { x: number, y: number },
        bottomRight: { x: number, y: number }
        door: { isClosed: boolean, x: number, y: number } | null;
    };

    constructor(fields, coordinates) {
        this.fields = fields;
        this.coordinates = coordinates;
        this.generateBlocks();
    }

    isDoor(x: number, y: number) {
        if (!this.coordinates.door) {
            return false;
        }

        const { x: doorX, y: doorY } = this.coordinates.door;

        if (doorX === x && doorY === y) {
            return true;
        }
    }

    generateBlock(x: number, y: number) {
        let newField;

        if (this.isDoor(x, y)) {
            const isDoorClosed = this.coordinates.door.isClosed
            newField = new Door(this.fields, x, y, true, isDoorClosed);
        } else {
            newField = new Block(this.fields, x, y);
        }

        return newField;
    }

    generateBlocks() {
        const start = this.coordinates.topLeft;
        const end = this.coordinates.bottomRight;

        const fieldsCoordinates = [];

        for (let fieldX = start.x; fieldX <= end.x; fieldX++) {
            const isVericalWall = fieldX === start.x || fieldX === end.x;

            if (isVericalWall) {
                // Create vertical wall
                for (let fieldY = start.y; fieldY <= end.y; fieldY++) {
                    fieldsCoordinates.push({ x: fieldX, y: fieldY })
                }
            } else {
                // Create opposite Y walls
                fieldsCoordinates.push({ x: fieldX, y: start.y })
                fieldsCoordinates.push({ x: fieldX, y: end.y })
            }
        }

        this.blocks = fieldsCoordinates.map((fieldCoordinates) => {
            return this.generateBlock(fieldCoordinates.x, fieldCoordinates.y)
        })
    }

    getBlocks() {
        return this.blocks;
    }
}

export default Building;
