import GameObject from "@/gameObject/GameObject";
import { GameObjectAttributes } from "@/gameObject/types";

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

	addToCanvas(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "#000000";

		const { x, y } = this.getPosition();

		if (this.getCanOccupiedFields()) {
			ctx.fillRect(x * 50, y * 50, 50, 50);  // x, y, width, height
		} else {
			ctx.fillRect(x * 50, y * 50, 10, 50);  // x, y, width, height
			ctx.fillRect(x * 50 + 40, y * 50, 10, 50);  // x, y, width, height
		}
	}
}

export default Door;
