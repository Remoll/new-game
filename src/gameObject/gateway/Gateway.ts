import { InstanceKey } from "@/game/gameInstanceData/types";
import Player from "../entity/player/Player";
import GameObject from "../GameObject";
import { GatewayAttributes } from "../types";
import Game from "@/game/Game";
import { Coordinates } from "@/types";
import itemFactory from "../item/itemFactory";

class Gateway extends GameObject {
    private targetInstanceKey: InstanceKey;
    private targetPlayerCoordinates: Coordinates;
    constructor(attributes: GatewayAttributes) {
        const { targetInstanceKey, targetPlayerCoordinates, ...restAttributes } = attributes;
        super(restAttributes, itemFactory);
        this.targetInstanceKey = targetInstanceKey;
        this.targetPlayerCoordinates = targetPlayerCoordinates;
    }

    movePlayerToNextMap() {
        const game = Game.getInstance();
        game.startNewInstance(this.targetInstanceKey, this.targetPlayerCoordinates);
    }

    handleInteract(gameObject: GameObject) {
        if (gameObject instanceof Player) {
            this.movePlayerToNextMap();
        }
    }
}

export default Gateway;
