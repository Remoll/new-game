import { GameObjectSelector } from '@/gameEvents/types.ts';
import { Disposition, EntityAttributes } from '@/gameObject/types.ts';
import Entity from '@/gameObject/entity/Entity.ts';
import GameObject from '@/gameObject/GameObject.ts';

class Npc extends Entity {
  constructor(attributes: EntityAttributes) {
    super(attributes);
  }

  private findAndCharge(target: GameObjectSelector) {
    const nearestGameObject = this.findNearestGameObject(target, true);

    if (!nearestGameObject) {
      return;
    }

    if (nearestGameObject instanceof Entity) {
      this.setFocusedEnemy(nearestGameObject);
    }

    this.chargeGameObject(nearestGameObject);
  }

  private chargeGameObject(gameObject: GameObject) {
    if (!this.isAlive()) {
      console.error("Entity is dead and can't take action");
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

    const nextField = this.getFieldFromCoordinates(nextX, nextY);

    if (!nextField) {
      console.error('no nextField from provided coordinates');
      return;
    }

    const gameObjectThatOccupiedField =
      nextField.getGameObjectThatOccupiedField();

    if (
      gameObjectThatOccupiedField &&
      gameObjectThatOccupiedField instanceof Entity &&
      this.getDispositionToFactions()?.[Disposition.FRIENDLY].some(
        (faction) => faction === gameObjectThatOccupiedField.getFaction()
      )
    ) {
      return;
    }

    this.takeActionToDirectionFromCoordinates(nextX, nextY);
  }

  takeTurn() {
    let focusedEnemy = this.getFocusedEnemy();

    if (focusedEnemy && !focusedEnemy.isAlive()) {
      this.setFocusedEnemy(null);
    }

    if (
      focusedEnemy &&
      !this.getVisibleEnemies().some((entity) => entity === focusedEnemy) &&
      focusedEnemy.isAlive()
    ) {
      this.getVisibleEnemies().push(focusedEnemy);
    }

    if (this.getVisibleEnemies().length < 1) {
      this.findVisibleEnemies();
      return;
    }

    const hostileEntities: GameObjectSelector = {
      id: this.getVisibleEnemies().map((entity) => entity.getId()),
    };

    if (
      focusedEnemy &&
      !this.getVisibleEnemies().some((entity) => entity === focusedEnemy) &&
      focusedEnemy.isAlive()
    ) {
      this.getVisibleEnemies().push(focusedEnemy);
    }

    if (!hostileEntities) {
      return;
    }

    this.findAndCharge(hostileEntities);

    this.findVisibleEnemies();

    focusedEnemy = this.getFocusedEnemy();

    if (
      focusedEnemy &&
      !this.getVisibleEnemies().some((entity) => entity === focusedEnemy) &&
      focusedEnemy.isAlive()
    ) {
      this.getVisibleEnemies().push(focusedEnemy);
    }
  }
}

export default Npc;
