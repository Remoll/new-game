import Item from "@/gameObject/item/Item";
import ReanimatePotion from "./touchable/reanimatePotion/ReanimatePotion";
import FireWand from "./projectile/fireWand/FireWand";
import { GameObjectAttributes } from "../types";

const itemFactory = (itemAttributes: GameObjectAttributes): Item => {
    switch (itemAttributes.type) {
        case "reanimatePotion":
            return new ReanimatePotion(itemAttributes);
        case "fireWand":
            return new FireWand(itemAttributes);
        default:
            return new Item(itemAttributes);
    }
};

export default itemFactory
