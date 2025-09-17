import Entity from "gameObject/entity/Entity";
import GameObject from "../GameObject";
import { Direction, GameObjectAttributes } from "gameObject/types";

class Item extends GameObject {
    private equippedBy: GameObject | null = null;
    protected isConsumables: boolean = false;

    constructor(attributes: GameObjectAttributes) {
        super(attributes);
    }

    getEquippedBy(): GameObject {
        return this.equippedBy;
    }

    addToCanvas(ctx: CanvasRenderingContext2D): void {
        if (this.equippedBy) {
            return;
        }

        const { x, y } = this.getPosition();

        ctx.fillStyle = "#b6b314ff";
        ctx.fillRect(x * 50, y * 50, 50, 50);  // x, y, width, height

        ctx.fillStyle = "#0f100aff";
        ctx.fillText(this.getType(), x * 50, y * 50);

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

    protected executeEffect(direction: Direction, userEntity: Entity) {
        // implement in subclasses
    }

    deleteItemFromWorld() {
        if (this.equippedBy) {
            this.equippedBy.removeItemFromInventory(this)
        }

        // TODO: remove item instance
    }

    use(direction: Direction, userEntity: Entity) {
        // TODO: check there is valid target or display info about itom lost

        this.executeEffect(direction, userEntity);

        if (this.isConsumables) {
            this.deleteItemFromWorld();
        }
    }
}

export default Item;
