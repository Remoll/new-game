import GameObject from "../GameObject";
import { Direction, GameObjectAttributes } from "gameObject/types";

class Item extends GameObject {
    private equippedBy: GameObject | null = null;

    constructor(attributes: GameObjectAttributes) {
        super(attributes);
    }

    addToCanvas(ctx: CanvasRenderingContext2D): void {
        if (this.equippedBy) {
            return;
        }

        const { x, y } = this.getPosition();

        ctx.fillStyle = "#b6b314ff";
        ctx.fillRect(x * 50, y * 50, 50, 50);  // x, y, width, height

        ctx.fillStyle = "#0f100aff";
        ctx.fillText("Item", x * 50, y * 50);

        const field = this.getCurrentField();
        field.addGameObjectToField(this);
    }

    handleInteract(gameObject: GameObject): void {
        gameObject.addItem(this);
        this.equippedBy = gameObject;
        this.setCanOccupiedFields(false);
        this.getCurrentField().removeGameObjectFromField(this);
        this.x = null;
        this.y = null;
    }

    use(direction: Direction) {
        console.log("item was used: ", direction)
    }
}

export default Item;
