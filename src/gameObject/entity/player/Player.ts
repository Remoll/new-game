import { Direction, EntityAttributes } from "@/gameObject/types";
import { emitPlayerMakeTurn } from "@/gameEvents/emiter/emittedActions";
import Entity from "@/gameObject/entity/Entity";
import Inventory from "@/ui/inventory/Inventory";
import Item from "@/gameObject/item/Item";

class Player extends Entity {
  private isInteracting: boolean = false;
  private isUsingItem: boolean = false;
  private itemToUse: Item | null = null;
  private inventory: Inventory = new Inventory();

  constructor(attributes: EntityAttributes) {
    super(attributes);
    this.addMoveListener();
  }

  getInventory(): Inventory {
    return this.inventory;
  }

  private setIsInteracting(isInteracting: boolean) {
    this.isUsingItem = false;
    this.isInteracting = isInteracting;
  }

  private takeInteraction(direction: Direction) {
    this.setIsInteracting(false);

    const { newX, newY } = this.findNewCoordinatesFromDirection(direction);

    const field = this.getFieldFromCoordinates(newX, newY);

    if (!field) {
      console.log("No field from coordinates");
      return;
    }

    const gameObjectsFromField = field.getGameObjectsFromField();

    const interactiveGameObjects = gameObjectsFromField.filter((gameObject) => gameObject.getIsInteractive());

    if (interactiveGameObjects.length === 1) {
      interactiveGameObjects[0].handleInteract(this);
      return;
    }

    if (interactiveGameObjects.length > 1) {
      // TODO: add popup with choice which GameObject to interact
      return;
    }

    console.log("No interactive entities on field");
  }

  useItem(direction: Direction) {
    this.isUsingItem = false;
    this.itemToUse.use(direction, this);
  }

  setIsUsingItem(key: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0) {
    this.itemToUse = this.inventory.getItemFromHotkey(key);
    this.isInteracting = false;
    if (!this.itemToUse) {
      console.log("no item for hotkey ", key)
      this.isUsingItem = false;
      return;
    }
    this.isUsingItem = true;
  }

  removeItemFromInventory(item: Item): void {
    this.inventory.removeItemFromHotkey(item)
    this.items = this.items.filter((itemInInventory) => itemInInventory.getId() !== item.getId());
  }

  private addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      if (this.inventory.getIsOpen()) {
        switch (key) {
          case "a":
            this.inventory.selectPrev();
            return;
          case "d":
            this.inventory.selectNext();
            return;
          case "1":
            this.inventory.setHotkey(1);
            return;
          case "2":
            this.inventory.setHotkey(2);
            return;
          case "3":
            this.inventory.setHotkey(3);
            return;
          case "4":
            this.inventory.setHotkey(4);
            return;
          case "5":
            this.inventory.setHotkey(5);
            return;
          case "6":
            this.inventory.setHotkey(6);
            return;
          case "7":
            this.inventory.setHotkey(7);
            return;
          case "8":
            this.inventory.setHotkey(8);
            return;
          case "9":
            this.inventory.setHotkey(9);
            return;
          case "0":
            this.inventory.setHotkey(0);
            return;
          case "q":
            this.inventory.toggle(this.getItems())
            return;
          default:
            return;
        }
      } else {
        switch (key) {
          case "w":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.UP))
              return;
            }
            if (this.isUsingItem) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.UP))
              return;
            }
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.UP))
            return;
          case "s":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.DOWN))
              return;
            }
            if (this.isUsingItem) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.DOWN))
              return;
            }
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.DOWN))
            return;
          case "a":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.LEFT))
              return;
            }
            if (this.isUsingItem) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.LEFT))
              return;
            }
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.LEFT))
            return;
          case "d":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.RIGHT))
              return;
            }
            if (this.isUsingItem) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.RIGHT))
              return;
            }
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.RIGHT))
            return;
          case " ":
            emitPlayerMakeTurn(this, () => this.wait())
            return;
          case "e":
            this.setIsInteracting(!this.isInteracting);
            return;
          case "q":
            this.inventory.toggle(this.getItems())
            this.isInteracting = false;
            this.isUsingItem = false;
            return;
          case "1":
            this.setIsUsingItem(1);
            return;
          case "2":
            this.setIsUsingItem(2);
            return;
          case "3":
            this.setIsUsingItem(3);
            return;
          case "4":
            this.setIsUsingItem(4);
            return;
          case "5":
            this.setIsUsingItem(5);
            return;
          case "6":
            this.setIsUsingItem(6);
            return;
          case "7":
            this.setIsUsingItem(7);
            return;
          case "8":
            this.setIsUsingItem(8);
            return;
          case "9":
            this.setIsUsingItem(9);
            return;
          case "0":
            this.setIsUsingItem(0);
            return;
          default:
            return;
        }
      }
    });
  }
}

export default Player;
