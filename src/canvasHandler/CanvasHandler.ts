import Entity from "entity/Entity";
import GameMap from "gameMap/GameMap";

class CanvasHandler {
    entities: Entity[];
    gameMap: GameMap;
    ctx;

    constructor(ctx, entities: Entity[], gameMap: GameMap) {
        this.ctx = ctx;
        this.entities = entities;
        this.gameMap = gameMap;
    }

    renderGameState() {
        this.gameMap.addToCanvas(this.ctx);
        this.entities.forEach((entity) => {
            if (entity.isAlive()) {
                entity.addToCanvas(this.ctx)
            }
        })
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, 500, 500)
    }
}

export default CanvasHandler;