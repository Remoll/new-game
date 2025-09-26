import Field from "@/gameMap/field/Field";
import { BuildingCoordinates, GenerateRandomBuildingsCoordinatesOptions } from "./types";
import Block from "@/gameObject/block/Block";
import Door from "@/gameObject/block/Door";
import { Coordinates } from "@/types";
import { ImageKey } from "@/imageManager/types";

class Building {
	private blocks: (Block | Door)[];
	private fields: Field[];
	private coordinates: BuildingCoordinates;

	constructor(fields: Field[], coordinates: BuildingCoordinates) {
		this.fields = fields;
		this.coordinates = coordinates;
		this.generateBlocks();
	}

	private findDoor(x: number, y: number): { isClosed: boolean, coordinates: Coordinates } | null {
		if (!this.coordinates.doors) {
			return null;
		}
		return this.coordinates.doors.find((door) => {
			const { x: doorX, y: doorY } = door.coordinates;
			return doorX === x && doorY === y;
		}) || null;
	}

	private generateBlock(x: number, y: number): Block | Door {
		let newField: Block | Door;

		const door = this.findDoor(x, y);

		if (door) {
			newField = new Door({ fields: this.fields, type: "door", x, y, imagesKeys: { default: ImageKey.DOOR_CLOSED, dead: ImageKey.DOOR_OPEN }, canOccupiedFields: true, isInteractive: true }, door.isClosed);
		} else {
			newField = new Block({ fields: this.fields, type: "block", x, y, imagesKeys: { default: ImageKey.BLOCK, dead: ImageKey.BLOCK }, canOccupiedFields: true, isInteractive: false });
		}

		return newField;
	}

	private generateBlocks() {
		const start = this.coordinates.topLeft;
		const end = this.coordinates.bottomRight;

		const fieldsCoordinates: Coordinates[] = [];

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

	static generateRandomBuildingsCoordinates(options: GenerateRandomBuildingsCoordinatesOptions): BuildingCoordinates[] {
		const buildings: BuildingCoordinates[] = [];
		let attempts = 0;
		while (buildings.length < options.count && attempts < options.count * 20) {
			const width = Math.floor(Math.random() * (options.maxWidth - options.minWidth + 1)) + options.minWidth;
			const height = Math.floor(Math.random() * (options.maxHeight - options.minHeight + 1)) + options.minHeight;
			// Ensure a gap of at least 1 field from the map edges
			const x = Math.floor(Math.random() * (options.mapWidth - width - 2)) + 1;
			const y = Math.floor(Math.random() * (options.mapHeight - height - 2)) + 1;

			const newTopLeft = { x, y };
			const newBottomRight = { x: x + width - 1, y: y + height - 1 };

			// Check for overlap or touching (gap of at least 1 field)
			const expandedNewTopLeft = { x: newTopLeft.x - 1, y: newTopLeft.y - 1 };
			const expandedNewBottomRight = { x: newBottomRight.x + 1, y: newBottomRight.y + 1 };
			const overlaps = buildings.some(b =>
				expandedNewTopLeft.x <= b.bottomRight.x + 1 && expandedNewBottomRight.x >= b.topLeft.x - 1 &&
				expandedNewTopLeft.y <= b.bottomRight.y + 1 && expandedNewBottomRight.y >= b.topLeft.y - 1
			);

			if (!overlaps) {
				// Generate random number of doors (1 to 3 for example)
				const doorCount = Math.floor(Math.random() * 3) + 1;
				const doors = [];
				for (let d = 0; d < doorCount; d++) {
					// Place doors on valid wall positions, avoiding corners
					let doorX = x, doorY = y;
					const wall = d % 4;
					if (wall === 0) { // bottom wall
						// x + 1 to x + width - 2 (avoid corners)
						if (width > 2) {
							doorX = x + 1 + Math.floor((width - 2) * Math.random());
						} else {
							doorX = x; // fallback for tiny buildings
						}
						doorY = y + height - 1;
					} else if (wall === 1) { // top wall
						if (width > 2) {
							doorX = x + 1 + Math.floor((width - 2) * Math.random());
						} else {
							doorX = x;
						}
						doorY = y;
					} else if (wall === 2) { // left wall
						if (height > 2) {
							doorY = y + 1 + Math.floor((height - 2) * Math.random());
						} else {
							doorY = y;
						}
						doorX = x;
					} else { // right wall
						if (height > 2) {
							doorY = y + 1 + Math.floor((height - 2) * Math.random());
						} else {
							doorY = y;
						}
						doorX = x + width - 1;
					}
					doors.push({
						coordinates: { x: doorX, y: doorY },
						isClosed: Math.random() < 0.5
					});
				}

				buildings.push({
					topLeft: newTopLeft,
					bottomRight: newBottomRight,
					doors
				});
			}
			attempts++;
		}
		return buildings;
	}
}

export default Building;
