import Entity from "entity/Entity";
import { Direction } from "entity/types";
import { emitPlayerMakeTurn } from "events/emiter/emittedActions";

class Player extends Entity {
  private isInteract: boolean = false;

  constructor(fields, x, y) {
    super(fields, "player", x, y, { hp: 200 });
    this.addMoveListener();
  }

  setIsInteract(isInteract: boolean) {
    this.isInteract = isInteract;
  }

  takeInteraction(direction: Direction) {
    this.setIsInteract(false);

    const { newX, newY } = this.findNewCoorinatedFromDirection(direction);

    const field = this.getFieldFromCoordinates(newX, newY);

    if (!field) {
      console.log("No field from coordinates");
      return;
    }

    const entitiesFromField = field.getEntitiesFromField();

    const interactiveEntities = entitiesFromField.filter((entity) => entity.getIsInteractive());

    if (interactiveEntities.length === 1) {
      interactiveEntities[0].handleInteract();
      return;
    }

    if (interactiveEntities.length > 1) {
      // TODO: add popup with choice which entity to interact
      return;
    }

    console.log("No interactive entities on field");
  }

  addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "w":
          if (this.isInteract) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.UP))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.UP))
          return;
        case "s":
          if (this.isInteract) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.DOWN))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.DOWN))
          return;
        case "a":
          if (this.isInteract) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.LEFT))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.LEFT))
          return;
        case "d":
          if (this.isInteract) {
            emitPlayerMakeTurn(this, () => this.takeInteraction(Direction.RIGHT))
            return;
          }
          emitPlayerMakeTurn(this, () => this.takeAction(Direction.RIGHT))
          return;
        case " ":
          emitPlayerMakeTurn(this, () => this.wait())
          return;
        case "e":
          this.setIsInteract(!this.isInteract);
          return;
        default:
          return;
      }
    });
  }
}

export default Player;
