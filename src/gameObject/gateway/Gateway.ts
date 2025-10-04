import { InstanceKey } from '@/game/gameInstanceData/types.ts';
import Player from '../entity/player/Player.ts';
import GameObject from '../GameObject.ts';
import { GatewayAttributes } from '../types.ts';
import Game from '@/game/Game.ts';
import { Coordinates } from '@/types.ts';
import itemFactory from '../item/itemFactory.ts';

class Gateway extends GameObject {
  private targetInstanceKey: InstanceKey;
  private targetPlayerCoordinates: Coordinates;
  constructor(attributes: GatewayAttributes) {
    const { targetInstanceKey, targetPlayerCoordinates, ...restAttributes } =
      attributes;
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
