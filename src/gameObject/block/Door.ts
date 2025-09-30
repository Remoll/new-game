import GameObject from "@/gameObject/GameObject";
import { GameObjectAttributes } from "@/gameObject/types";
import ImageManager from "@/imageManager/ImageManager";
import { Coordinates } from "@/types";

class Door extends GameObject {
	constructor(attributes: GameObjectAttributes, isClosed = true) {
		super({ ...attributes, canOccupiedFields: isClosed });
	}

	handleInteract() {
		const currentField = this.getCurrentField();
		const gameObjectThatOccupiedField = currentField.getGameObjectThatOccupiedField();
		const isDoorOpen = !this.getCanOccupiedFields();
		if (isDoorOpen && gameObjectThatOccupiedField) {
			console.log("Can't close door, some game object in on the field")
			return;
		}
		this.setCanOccupiedFields(!this.getCanOccupiedFields())
	}

	addToCanvas(ctx: CanvasRenderingContext2D, fieldShift: Coordinates, fieldSize: number) {
		const { x, y } = this.getPosition();
		ctx.drawImage(ImageManager.instance.getImage(this.getCanOccupiedFields() ? this.getImagesKeys().default : this.getImagesKeys().dead), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize, fieldSize, fieldSize)
	}
}

export default Door;
