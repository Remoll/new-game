import { GameInstanceKey } from '@/gameInstance/types.ts';
import Player from '../entity/player/Player.ts';
import GameObject from '../GameObject.ts';
import { GatewayAttributes } from '../types.ts';
import Game from '@/game/Game.ts';
import { Coordinates } from '@/types.ts';
import itemFactory from '../item/itemFactory.ts';

class Gateway extends GameObject {
  private targetGameInstanceKey: GameInstanceKey;
  private targetPlayerCoordinates: Coordinates;
  constructor(attributes: GatewayAttributes) {
    const {
      targetGameInstanceKey,
      targetPlayerCoordinates,
      ...restAttributes
    } = attributes;
    super(restAttributes, itemFactory);
    this.targetGameInstanceKey = targetGameInstanceKey;
    this.targetPlayerCoordinates = targetPlayerCoordinates;
  }

  movePlayerToNextMap() {
    const game = Game.getSingleton();
    game.startNewGameInstance(
      this.targetGameInstanceKey,
      this.targetPlayerCoordinates
    );
  }

  handleInteract(gameObject: GameObject) {
    if (gameObject instanceof Player) {
      this.movePlayerToNextMap();
    }
  }
}

export default Gateway;
