import { GameObjectSelector } from "@/gameEvents/types";
import { Disposition, EntityAttributes } from "@/gameObject/types";
import Entity from "@/gameObject/entity/Entity";
import GameObject from "@/gameObject/GameObject";

class Npc extends Entity {
  constructor(attributes: EntityAttributes) {
    super(attributes);
  }

  private findAndCharge(target: GameObjectSelector) {
    const nearestGameObject = this.findNearestGameObject(target, true);

    if (!nearestGameObject) {
      console.log("nearestGameObject not found");
      return;
    }

    this.chargeGameObject(nearestGameObject)
  }

  private chargeGameObject(gameObject: GameObject) {
    if (!this.isAlive()) {
      console.log("Entity is dead and can't take action")
      return;
    }

    const { x: gameObjectX, y: gameObjectY } = gameObject.getPosition();

    if (gameObjectX < 0 || gameObjectY < 0) return;

    const path = this.findShortestPath(gameObjectX, gameObjectY);

    // path === null -> unreachable
    // path === [] -> already on player
    if (!path || path.length === 0) {
      // if path is empty and we are on the player, do nothing (or attack if desired)
      return;
    }

    const [nextX, nextY] = path[0];

    this.takeActionToDirectionFromCoordinates(nextX, nextY)
  }

  takeTurn() {
    const hostileFactions = this.getDispositionToFactions()?.[Disposition.HOSTILE];

    if (!hostileFactions) {
      console.log("No hostile factions defined for this entity. Can't take turn.");
      return;
    }

    this.findAndCharge({ factions: hostileFactions })
  }
}

export default Npc;
