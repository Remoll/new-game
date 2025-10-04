import Player from '../entity/player/Player.ts';
import GameObject from '../GameObject.ts';
import itemFactory from '../item/itemFactory.ts';
import { GameObjectAttributes } from '../types.ts';

class Chest extends GameObject {
  constructor(attributes: GameObjectAttributes) {
    super(attributes, itemFactory);
  }

  handleInteract(gameObject: GameObject): void {
    if (gameObject instanceof Player) {
      const itemsInChest = this.getItems();

      if (itemsInChest) {
        itemsInChest.forEach((item) => {
          gameObject.addItem(item);
          this.removeItemFromInventory(item);
        });
      }
    }
  }
}

export default Chest;
