import GameObject from "@/gameObject/GameObject";
import { GameObjectAttributes } from "@/gameObject/types";
import Player from "../entity/player/Player";
import ImageManager from "@/imageManager/ImageManager";
import { Coordinates } from "@/types";
import { InventorySlot } from "@/ui/inventory/types";

class Item extends GameObject {
    private equippedBy: GameObject | null = null;
    protected isConsumables: boolean = false;

    constructor(attributes: GameObjectAttributes) {
        super(attributes);
    }

    getEquippedBy(): GameObject {
        return this.equippedBy;
    }

    addToCanvas(ctx: CanvasRenderingContext2D, fieldShift: Coordinates, fieldSize: number): void {
        if (this.equippedBy) {
            return;
        }

        const { x, y } = this.getPosition();

        ctx.drawImage(ImageManager.instance.getImage(this.getImagesKeys().default), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize)
    }

    handleInteract(gameObject: GameObject): void {
        gameObject.addItem(this);
        this.equippedBy = gameObject;
        if (gameObject instanceof Player) {
            const playerInventory = gameObject.getInventory();
            const inventorySlots: InventorySlot[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
            const firstEmptySlot: InventorySlot = inventorySlots.find((slot) => {
                return !playerInventory.getItemFromHotkey(slot)
            })
            playerInventory.setHotkey(firstEmptySlot, this);
        }
        this.setCanOccupiedFields(false);
        this.getCurrentField().removeGameObjectFromField(this);
        this.x = null;
        this.y = null;
    }

    protected executeEffect(...args: unknown[]) {
        // implement in subclasses
    }

    deleteItemFromWorld() {
        if (this.equippedBy) {
            this.equippedBy.removeItemFromInventory(this)
        }

        // TODO: remove item instance
    }

    use(...args: unknown[]) {
        // TODO: check there is valid target or display info about itom lost

        this.executeEffect(...args);

        if (this.isConsumables) {
            this.deleteItemFromWorld();
        }
    }
}

export default Item;
