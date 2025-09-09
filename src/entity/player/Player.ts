import Entity from "entity/Entity";
import { Direction, Faction } from "entity/types";
import { emitPlayerMakeTurn } from "events/emiter/emittedActions";
import Field from "gameMap/field/Field";

class Player extends Entity {
  private isInteracting: boolean = false;

  constructor(fields: Field[], x: number, y: number) {
    super(fields, "player", x, y, { hp: 200, faction: Faction.PLAYER });
    this.addMoveListener();
  }

  private setIsInteract(isInteracting: boolean) {
    this.isInteracting = isInteracting;
  }

  private takeInteraction(direction: Direction) {
    this.setIsInteract(false);

    const { newX, newY } = this.findNewCoordinatesFromDirection(direction);

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
          this.setIsInteract(!this.isInteracting);
          return;
        default:
          return;
      }
    });
  }
}

export default Player;
