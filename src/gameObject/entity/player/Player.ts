import { Direction, EntityAttributes } from "@/gameObject/types";
import { emitPlayerMakeTurn } from "@/gameEvents/emiter/emittedActions";
import Entity from "@/gameObject/entity/Entity";
import Inventory from "@/ui/inventory/Inventory";
import Item from "@/gameObject/item/Item";
import Field from "@/gameMap/field/Field";
import Touchable from "@/gameObject/item/touchable/Touchable";
import Projectile from "@/gameObject/item/projectile/Projectile";
import GameState from "@/game/GameState";
import { Coordinates } from "@/types";
import { InventorySlot } from "@/ui/inventory/types";
import Equipment from "@/gameObject/item/equipment/Equipment";
import ImageManager from "@/imageManager/ImageManager";
import { EquipmentSlot } from "@/gameObject/item/equipment/types";

class Player extends Entity {
  private isInteracting: boolean = false;
  private isUsingItemTouchable: boolean = false;
  private isUsingItemProjectable: boolean = false;
  private itemToUse: Item | null = null;
  private inventory: Inventory = new Inventory();

  constructor(attributes: EntityAttributes) {
    super(attributes);
    this.addMoveListener();

    this.setInitialHotkey()
  }

  private setInitialHotkey(): void {
    let hotkey: InventorySlot = 1;

    this.getItems().forEach((item, index) => {
      if (index <= 9) {
        this.inventory.setHotkey(hotkey, item)
        if (hotkey <= 9) {
          hotkey++
        } else {
          hotkey = 0
        }
      }
    })
  }

  private resetInteraction(): void {
    this.isInteracting = false;
    this.isUsingItemTouchable = false;
    this.isUsingItemProjectable = false;
  }

  getInventory(): Inventory {
    return this.inventory;
  }

  private setIsInteracting(isInteracting: boolean) {
    this.resetInteraction();

    this.isInteracting = isInteracting;
  }

  private takeInteraction(direction?: Direction) {
    this.resetInteraction();

    let field: Field;

    if (direction) {
      const { x: newX, y: newY } = this.findNewCoordinatesFromDirection(direction);
      field = this.getFieldFromCoordinates(newX, newY);
    } else {
      field = this.getCurrentField();
    }

    if (!field) {
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

  useItem(...args: unknown[]) {
    this.resetInteraction();
    this.itemToUse.use(...args);
  }

  initUsingItem(key: InventorySlot) {
    this.resetInteraction();

    this.itemToUse = this.inventory.getItemFromHotkey(key);

    if (!this.itemToUse) {
      return;
    }

    if (this.itemToUse instanceof Equipment) {
      this.resetInteraction();
      emitPlayerMakeTurn(this, () => this.itemToUse.use(this))
    } else if (this.itemToUse instanceof Touchable) {
      this.isUsingItemTouchable = true;
    } else if (this.itemToUse instanceof Projectile) {
      this.isUsingItemProjectable = true;
    }
  }

  removeItemFromInventory(item: Item): void {
    this.inventory.removeItemFromHotkey(item)
    this.items = this.items.filter((itemInInventory) => itemInInventory.getId() !== item.getId());
  }

  async addToCanvas(ctx: CanvasRenderingContext2D, fieldShift: Coordinates, fieldSize: number) {
    const { x, y } = this.getPosition();

    if (this.isAlive()) {
      ctx.fillStyle = "#c3ff00ff";
      ctx.fillText(`${this.getHp()}`, (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize);

      const mainHandItem = this.getEquipmentBySlot(EquipmentSlot.MAIN_HAND)

      if (mainHandItem) {
        ctx.drawImage(ImageManager.instance.getImage(mainHandItem.getImagesKeys().dead), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize, fieldSize, fieldSize)
      }
    }

    ctx.drawImage(ImageManager.instance.getImage(this.isAlive() ? this.getImagesKeys().default : this.getImagesKeys().dead), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize, fieldSize, fieldSize)
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
            if (this.isUsingItemTouchable) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.UP, this))
              return;
            }
            this.resetInteraction();
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.UP))
            return;
          case "s":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.DOWN))
              return;
            }
            if (this.isUsingItemTouchable) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.DOWN, this))
              return;
            }
            this.resetInteraction();
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.DOWN))
            return;
          case "a":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.LEFT))
              return;
            }
            if (this.isUsingItemTouchable) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.LEFT, this))
              return;
            }
            this.resetInteraction();
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.LEFT))
            return;
          case "d":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.RIGHT))
              return;
            }
            if (this.isUsingItemTouchable) {
              emitPlayerMakeTurn(this, () => this.useItem(Direction.RIGHT, this))
              return;
            }
            this.resetInteraction();
            emitPlayerMakeTurn(this, () => this.takeAction(Direction.RIGHT))
            return;
          case " ":
            if (this.isInteracting) {
              emitPlayerMakeTurn(this, () => this.takeInteraction())
              return;
            }
            this.resetInteraction();
            emitPlayerMakeTurn(this, () => this.wait())
            return;
          case "e":
            this.setIsInteracting(!this.isInteracting);
            return;
          case "q":
            this.inventory.toggle(this.getItems())
            this.isInteracting = false;
            this.isUsingItemTouchable = false;
            return;
          case "1":
            this.initUsingItem(1);
            return;
          case "2":
            this.initUsingItem(2);
            return;
          case "3":
            this.initUsingItem(3);
            return;
          case "4":
            this.initUsingItem(4);
            return;
          case "5":
            this.initUsingItem(5);
            return;
          case "6":
            this.initUsingItem(6);
            return;
          case "7":
            this.initUsingItem(7);
            return;
          case "8":
            this.initUsingItem(8);
            return;
          case "9":
            this.initUsingItem(9);
            return;
          case "0":
            this.initUsingItem(0);
            return;
          default:
            return;
        }
      }
    });

    document.addEventListener("click", (event: PointerEvent) => {
      if (this.isUsingItemProjectable) {
        const getCoordinatesFromCanvasClick = (canvas: HTMLCanvasElement): Coordinates => {
          const { left, top } = canvas.getBoundingClientRect();
          return {
            x: event.clientX - left,
            y: event.clientY - top
          };
        }

        if ((event.target as HTMLElement).id === "canvas") {
          const coordinatesFromCanvasClick: Coordinates = getCoordinatesFromCanvasClick(event.target as HTMLCanvasElement);
          const playerAndCenterDifference: Coordinates = GameState.getPlayerAndCenterDifference();
          const fieldSize: number = GameState.getFieldSize();

          const targetX = Math.floor(coordinatesFromCanvasClick.x / fieldSize) + playerAndCenterDifference.x;
          const targetY = Math.floor(coordinatesFromCanvasClick.y / fieldSize) + playerAndCenterDifference.y;

          emitPlayerMakeTurn(this, () => this.useItem({ x: this.x, y: this.y }, { x: targetX, y: targetY }))
        }
      }
    })
  }
}

export default Player;
