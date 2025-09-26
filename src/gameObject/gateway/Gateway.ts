import { InstanceKey } from "@/game/gameInstanceData/types";
import Player from "../entity/player/Player";
import GameObject from "../GameObject";
import { GatewayAttributes } from "../types";
import Game from "@/game/Game";

class Gateway extends GameObject {
    private targetInstanceKey: InstanceKey;
    constructor(attributes: GatewayAttributes) {
        const { targetInstanceKey, ...restAttributes } = attributes;
        super(restAttributes);
        this.targetInstanceKey = targetInstanceKey;
    }

    movePlayerToNextMap() {
        // TODO: remove all unnecessery elements ?
        const game = Game.getInstance();
        game.startNewInstance(this.targetInstanceKey);
    }

    handleInteract(gameObject: GameObject) {
        if (gameObject instanceof Player) {
            this.movePlayerToNextMap();
        }
    }
}

export default Gateway;
