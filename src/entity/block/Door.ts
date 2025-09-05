import Entity from "../Entity";

class Door extends Entity {
	constructor(fields, x, y, _, isClosed = true, isInteractive = true) {
		super(fields, "door", x, y, true, isClosed, isInteractive);
	}

	handleInteract() {
		const currentField = this.getCurrentField();
		const entityThatOccupiedField = currentField.getEntityThatOccupiedField();
		const isDoorOpen = !this.getCanOccupiedFields();
		if (isDoorOpen && entityThatOccupiedField) {
			console.log("Can't close door, some entity in on the field")
			return;
		}
		this.setCanOccupiedFields(!this.getCanOccupiedFields())
	}

	addToCanvas(ctx) {
		ctx.fillStyle = "#000000";

		if (this.getCanOccupiedFields()) {
			ctx.fillRect(this.x * 50, this.y * 50, 50, 50);  // x, y, width, height
		} else {
			ctx.fillRect(this.x * 50, this.y * 50, 10, 50);  // x, y, width, height
			ctx.fillRect(this.x * 50 + 40, this.y * 50, 10, 50);  // x, y, width, height
		}

		const field = this.getCurrentField();
		field.addEntityToField(this);
	}
}

export default Door;
