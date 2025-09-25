import { GameObjectAttributes } from "@/gameObject/types";
import Projectile from "../Projectile";
import { Coordinates } from "@/types";
import Entity from "@/gameObject/entity/Entity";
import { emitAnimateEffect } from "@/gameEvents/emiter/emittedActions";
import { ImageKey } from "@/imageManager/types";
import GameState from "@/game/GameState";

class FireBallScroll extends Projectile {
    constructor(attributes: GameObjectAttributes) {
        super(attributes);
        this.isConsumables = false;
    }

    private isLineClearSupercover(
        x0: number, y0: number,
        x1: number, y1: number,
        opts: { excludeStart?: boolean; includeEnd?: boolean } = {}
    ): { clear: boolean, checked: [number, number][] } {
        const excludeStart = !!opts.excludeStart;
        const includeEnd = opts.includeEnd !== undefined ? opts.includeEnd : true;

        const checked: Array<[number, number]> = [];

        let dx = x1 - x0;
        let dy = y1 - y0;

        const stepX = dx > 0 ? 1 : -1;
        const stepY = dy > 0 ? 1 : -1;

        const tDeltaX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
        const tDeltaY = dy !== 0 ? Math.abs(1 / dy) : Infinity;

        let x = x0;
        let y = y0;

        let tMaxX = tDeltaX;
        let tMaxY = tDeltaY;

        while (true) {
            if (!(excludeStart && x === x0 && y === y0) &&
                !(!includeEnd && x === x1 && y === y1)) {
                checked.push([x, y]);
                const f = this.getFieldFromCoordinates(x, y);
                if (!f || f.getIsOccupied()) {
                    return { clear: false, checked };
                }
            }

            if (x === x1 && y === y1) break;

            if (tMaxX < tMaxY) {
                x += stepX;
                tMaxX += tDeltaX;
            } else if (tMaxY < tMaxX) {
                y += stepY;
                tMaxY += tDeltaY;
            } else {
                // linia przechodzi dokładnie przez narożnik → sprawdź obie komórki
                x += stepX;
                y += stepY;
                tMaxX += tDeltaX;
                tMaxY += tDeltaY;
            }
        }

        return { clear: true, checked };
    };

    executeEffect(userCoordinates: Coordinates, targetCoordinates: Coordinates): void {
        // TODO: move effect to Effect class
        const { x: targetX, y: targetY } = targetCoordinates;
        const { x: userX, y: userY } = userCoordinates;

        const result = this.isLineClearSupercover(
            userX, userY,   // gracz
            targetX, targetY,   // wróg
            { excludeStart: true, includeEnd: false }
        );

        const effectPath: [number, number][] = [[userX, userY], ...result.checked];

        if (result.clear) {
            effectPath.push([targetX, targetY]);
        }

        const playerAndCenterDifference = GameState.getPlayerAndCenterDifference();

        const convertedPathForAnimation: [number, number][] = effectPath.map((step) => [step[0] - playerAndCenterDifference.x, step[1] - playerAndCenterDifference.y]);
        emitAnimateEffect(this, { imageKey: ImageKey.FIRE_ORB, effectPath: convertedPathForAnimation });

        const pathLastStep = effectPath[effectPath.length - 1];
        const colisionCoordinates: Coordinates = { x: pathLastStep[0], y: pathLastStep[1] }

        const field = this.getFieldFromCoordinates(colisionCoordinates.x, colisionCoordinates.y);
        const gameObjectThatOccupiedField = field?.getGameObjectThatOccupiedField();
        if (gameObjectThatOccupiedField instanceof Entity) {
            gameObjectThatOccupiedField.takeDamage(50);
        }
    }
}

export default FireBallScroll
