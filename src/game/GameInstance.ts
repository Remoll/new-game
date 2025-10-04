import GameMap from '@/gameMap/GameMap.ts';
import Building from '@/gameMap/building/Building.ts';
import Npc from '@/gameObject/entity/npc/Npc.ts';
import Gateway from '@/gameObject/gateway/Gateway.ts';
import GameObject from '@/gameObject/GameObject.ts';
import { InstanceData } from '@/game/gameInstanceData/types.ts';
import Item from '@/gameObject/item/Item.ts';
import Block from '@/gameObject/block/Block.ts';
import Door from '@/gameObject/block/Door.ts';
import GameState from './GameState.ts';
import Workshop from '@/gameObject/workshop/Workshop.ts';
import Chest from '@/gameObject/chest/Chest.ts';
import itemFactory from '@/gameObject/item/itemFactory.ts';

class GameInstance {
  private gameObjects: GameObject[] = [];
  private gameMap: GameMap;

  constructor(instanceData: InstanceData) {
    this.createInstance(instanceData);
  }

  createInstance(instanceData: InstanceData) {
    GameState.setGameMapWidth(instanceData.mapSize.width);
    GameState.setGameMapHeight(instanceData.mapSize.height);

    const gameMap = new GameMap();
    const fields = gameMap.getFields();

    GameState.setFields(fields);

    const npcs: Npc[] = instanceData.npcs.map(
      (npcData) => new Npc({ ...npcData })
    );

    const buildings: Building[] = instanceData.buildingsCoordinates.map(
      (buildingCoordinates) => new Building(buildingCoordinates)
    );
    const blocksFromBuildings: (Block | Door)[] = buildings.flatMap(
      (building) => building.getBlocks()
    );

    const items: Item[] = instanceData.items.map(itemFactory);

    const gateways: Gateway[] = instanceData.gateways.map(
      (gateway) => new Gateway({ ...gateway })
    );

    const workshops: Workshop[] =
      instanceData.workshops?.map(
        (workshop) => new Workshop({ ...workshop })
      ) || [];

    const chests: Chest[] =
      instanceData.chests?.map((chest) => new Chest({ ...chest })) || [];

    const restGameObjects: GameObject[] =
      instanceData.gameObjects?.map(
        (gameObject) => new GameObject({ ...gameObject }, itemFactory)
      ) || [];

    this.gameObjects = [
      ...npcs,
      ...blocksFromBuildings,
      ...items,
      ...gateways,
      ...workshops,
      ...chests,
      ...restGameObjects,
    ];
    this.gameMap = gameMap;
  }

  getGameObjects(): GameObject[] {
    return this.gameObjects;
  }

  getGameMap(): GameMap {
    return this.gameMap;
  }
}

export default GameInstance;
