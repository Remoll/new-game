import { GameObjectAttributes } from "@/gameObject/types";
import Equipment from "../Equipment";
import { EquipmentSlot } from "../types";

class Sword extends Equipment {
    constructor(attributes: GameObjectAttributes) {
        super(attributes, EquipmentSlot.MAIN_HAND);
    }
}

export default Sword;
