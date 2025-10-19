import GameMap from '@/gameMap/GameMap.ts';
import Building from '@/gameMap/building/Building.ts';
import Npc from '@/gameObject/entity/npc/Npc.ts';
import Gateway from '@/gameObject/gateway/Gateway.ts';
import GameObject from '@/gameObject/GameObject.ts';
import { GameInstanceData } from '@/gameInstance/types.ts';
import Item from '@/gameObject/item/Item.ts';
import Block from '@/gameObject/block/Block.ts';
import Door from '@/gameObject/block/Door.ts';
import GameState from '../gameState/GameState.ts';
import Workshop from '@/gameObject/workshop/Workshop.ts';
import Chest from '@/gameObject/chest/Chest.ts';
import itemFactory from '@/gameObject/item/itemFactory.ts';

class GameInstance {
  private gameObjects: GameObject[] = [];
  private gameMap: GameMap;

  constructor(gameInstanceData: GameInstanceData) {
    this.createInstance(gameInstanceData);
  }

  createInstance(gameInstanceData: GameInstanceData) {
    GameState.setGameMapWidth(gameInstanceData.mapSize.x);
    GameState.setGameMapHeight(gameInstanceData.mapSize.y);

    const gameMap = new GameMap(gameInstanceData.fields);
    const fields = gameMap.getFields();

    GameState.setFields(fields);

    const npcs: Npc[] = gameInstanceData.npcs.map(
      (npcData) => new Npc({ ...npcData })
    );

    const buildings: Building[] =
      gameInstanceData.buildingsCoordinates?.map(
        (buildingCoordinates) => new Building(buildingCoordinates)
      ) || [];
    const blocksFromBuildings: (Block | Door)[] = buildings.flatMap(
      (building) => building.getBlocks()
    );

    const blocks: Block[] =
      gameInstanceData.blocks?.map((block) => new Block({ ...block })) || [];

    const items: Item[] = gameInstanceData.items.map(itemFactory);

    const gateways: Gateway[] = gameInstanceData.gateways.map(
      (gateway) => new Gateway({ ...gateway })
    );

    const workshops: Workshop[] =
      gameInstanceData.workshops?.map(
        (workshop) => new Workshop({ ...workshop })
      ) || [];

    const chests: Chest[] =
      gameInstanceData.chests?.map((chest) => new Chest({ ...chest })) || [];

    const restGameObjects: GameObject[] =
      gameInstanceData.gameObjects?.map(
        (gameObject) => new GameObject({ ...gameObject }, itemFactory)
      ) || [];

    this.gameObjects = [
      ...npcs,
      ...blocksFromBuildings,
      ...blocks,
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
