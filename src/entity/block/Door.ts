import Entity from "../Entity";

class Door extends Entity {
    constructor(fields, x, y, _, isClosed = true) {
        super(fields, "door", x, y, true, isClosed);
    }

    addToCanvas(ctx) {
        ctx.fillStyle = "#000000";

        if (this.canOccupiedFields) {
            ctx.fillRect(this.x * 50, this.y * 50, 50, 50);  // x, y, width, height
        } else {
            ctx.fillRect(this.x * 50, this.y * 50, 10, 50);  // x, y, width, height
            ctx.fillRect(this.x * 50 + 40, this.y * 50, 10, 50);  // x, y, width, height
        }


        this.setIsOccupied(this.x, this.y, true);
    }
}

export default Door;
