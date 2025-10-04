import { GameObjectAttributes } from '@/gameObject/types.ts';
import Projectile from '../Projectile.ts';
import { Coordinates } from '@/types.ts';
import Entity from '@/gameObject/entity/Entity.ts';
import { emitAnimateEffect } from '@/gameEvents/emiter/emittedActions.ts';
import { ImageKey } from '@/imageManager/types.ts';
import GameState from '@/gameState/GameState.ts';

class FireWand extends Projectile {
  constructor(attributes: GameObjectAttributes) {
    super(attributes);
    this.isConsumables = false;
  }

  executeEffect(
    userCoordinates: Coordinates,
    targetCoordinates: Coordinates
  ): void {
    // TODO: move effect to Effect class
    const { x: targetX, y: targetY } = targetCoordinates;
    const { x: userX, y: userY } = userCoordinates;

    const result = GameState.hasLineOfSight(userX, userY, targetX, targetY);

    const effectPath: [number, number][] = [[userX, userY], ...result.checked];

    if (result.clear) {
      effectPath.push([targetX, targetY]);
    }

    const playerAndCenterDifference = GameState.getPlayerAndCenterDifference();

    const convertedPathForAnimation: [number, number][] = effectPath.map(
      (step) => [
        step[0] - playerAndCenterDifference.x,
        step[1] - playerAndCenterDifference.y,
      ]
    );
    emitAnimateEffect(this, {
      imageKey: ImageKey.FIRE_ORB,
      effectPath: convertedPathForAnimation,
    });

    const pathLastStep = effectPath[effectPath.length - 1];
    const colisionCoordinates: Coordinates = {
      x: pathLastStep[0],
      y: pathLastStep[1],
    };

    const field = this.getFieldFromCoordinates(
      colisionCoordinates.x,
      colisionCoordinates.y
    );
    const gameObjectThatOccupiedField = field?.getGameObjectThatOccupiedField();
    if (gameObjectThatOccupiedField instanceof Entity) {
      gameObjectThatOccupiedField.takeDamage(
        50,
        this.getEquippedBy() as Entity
      );
    }
  }
}

export default FireWand;
