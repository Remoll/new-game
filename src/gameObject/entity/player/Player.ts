import { Direction, EntityAttributes } from "gameObject/types";
import { emitPlayerMakeTurn } from "gameEvents/emiter/emittedActions";
import Entity from "../Entity";
import Inventory from "ui/inventory/Inventory";

class Player extends Entity {
  private isInteracting: boolean = false;
  private inventory: Inventory = new Inventory();

  constructor(attributes: EntityAttributes) {
    super(attributes);
    this.addMoveListener();
  }

  private setIsInteracting(isInteracting: boolean) {
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

  private addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "w":
          if (this.isInteracting) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.UP))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.UP))
          return;
        case "s":
          if (this.isInteracting) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.DOWN))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.DOWN))
          return;
        case "a":
          if (this.isInteracting) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.LEFT))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.LEFT))
          return;
        case "d":
          if (this.isInteracting) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.RIGHT))
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
        case "i":
          this.inventory.toggle(this.getItems())
          return;
        default:
          return;
      }
    });
  }
}

export default Player;
