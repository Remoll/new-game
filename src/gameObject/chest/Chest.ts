import Player from '../entity/player/Player.ts';
import GameObject from '../GameObject.ts';
import itemFactory from '../item/itemFactory.ts';
import { GameObjectProps } from '../types.ts';

class Chest extends GameObject {
  constructor(props: GameObjectProps) {
    super(props, itemFactory);
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
