import Field from "@/gameMap/field/Field";
import { BuildingCoordinates } from "./types";
import Block from "@/gameObject/block/Block";
import Door from "@/gameObject/block/Door";

class Building {
	private blocks: (Block | Door)[];
	private fields: Field[];
	private coordinates: BuildingCoordinates;

	constructor(fields: Field[], coordinates: BuildingCoordinates) {
		this.fields = fields;
		this.coordinates = coordinates;
		this.generateBlocks();
	}

	private isDoor(x: number, y: number) {
		if (!this.coordinates.door) {
			return false;
		}

		const { x: doorX, y: doorY } = this.coordinates.door;

		if (doorX === x && doorY === y) {
			return true;
		}
	}

	private generateBlock(x: number, y: number): Block | Door {
		let newField;

		if (this.isDoor(x, y)) {
			const isDoorClosed = this.coordinates.door.isClosed
			newField = new Door({ fields: this.fields, type: "door", x, y, canOccupiedFields: true, isInteractive: true }, isDoorClosed);
		} else {
			newField = new Block({ fields: this.fields, type: "block", x, y, canOccupiedFields: true, isInteractive: false });
		}

		return newField;
	}

	private generateBlocks() {
		const start = this.coordinates.topLeft;
		const end = this.coordinates.bottomRight;

		const fieldsCoordinates: { x: number, y: number }[] = [];

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
