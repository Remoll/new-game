import Entity from "../Entity";

class Door extends Entity {
	constructor(fields, x, y, isClosed = true) {
		super(fields, "door", x, y, { isPasive: true, canOccupiedFields: isClosed === undefined ? true : isClosed, isInteractive: true });
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

		const { x, y } = this.getPosition();

		if (this.getCanOccupiedFields()) {
			ctx.fillRect(x * 50, y * 50, 50, 50);  // x, y, width, height
		} else {
			ctx.fillRect(x * 50, y * 50, 10, 50);  // x, y, width, height
			ctx.fillRect(x * 50 + 40, y * 50, 10, 50);  // x, y, width, height
		}

		const field = this.getCurrentField();
		field.addEntityToField(this);
	}
}

export default Door;
