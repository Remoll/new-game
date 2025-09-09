import { TargetType } from "events/types";
import Entity from "../Entity";
import { Disposition, Faction } from "entity/types";
import Field from "gameMap/field/Field";

class Enemy extends Entity {
  constructor(fields: Field[], x: number, y: number) {
    super(fields, "enemy", x, y, { dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER] }, faction: Faction.ENEMY });
  }

  private findAndCharge(target: TargetType | Faction[]) {
    const nearestEntity = this.findNearestEntity(target);

    if (!nearestEntity) {
      console.log("No nearestEntity found");
      return;
    }

    this.chargeEntity(nearestEntity)
  }

  private chargeEntity(entity: Entity) {
    if (!this.isAlive) {
      console.log("Entity is dead and can't take action")
      return;
    }

    const { x: entityX, y: entityY } = entity.getPosition();

    if (entityX < 0 || entityY < 0) return;

    const path = this.findShortestPath(entityX, entityY);

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

    this.findAndCharge(hostileFactions)
  }
}

export default Enemy;
