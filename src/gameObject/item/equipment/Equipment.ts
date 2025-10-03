import { GameObjectAttributes } from "@/gameObject/types";
import Item from "@/gameObject/item/Item";
import Entity from "@/gameObject/entity/Entity";
import { EquipmentSlot } from "./types";

class Equipment extends Item {
    private slot: EquipmentSlot;

    constructor(attributes: GameObjectAttributes, slot: EquipmentSlot) {
        super(attributes);
        this.isConsumables = true;
        this.slot = slot;
    }

    getSlot(): EquipmentSlot {
        return this.slot;
    }

    executeEffect(user: Entity): void {
        user.equipItem(this);
    }
}

export default Equipment;
