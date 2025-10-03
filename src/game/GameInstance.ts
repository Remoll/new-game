import GameMap from "@/gameMap/GameMap";
import Building from "@/gameMap/building/Building";
import Npc from "@/gameObject/entity/npc/Npc";
import Gateway from "@/gameObject/gateway/Gateway";
import GameObject from "@/gameObject/GameObject";
import { InstanceData } from "@/game/gameInstanceData/types";
import Item from "@/gameObject/item/Item";
import Block from "@/gameObject/block/Block";
import Door from "@/gameObject/block/Door";
import GameState from "./GameState";
import Workshop from "@/gameObject/workshop/Workshop";
import Chest from "@/gameObject/chest/Chest";
import itemFactory from "@/gameObject/item/itemFactory";

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

        const npcs: Npc[] = instanceData.npcs.map((npcData) => new Npc({ ...npcData }));

        const buildings: Building[] = instanceData.buildingsCoordinates.map((buildingCoordinates) => new Building(buildingCoordinates));
        const blocksFromBuildings: (Block | Door)[] = buildings.flatMap((building) => building.getBlocks());

        const items: Item[] = instanceData.items.map(itemFactory);

        const gateways: Gateway[] = instanceData.gateways.map((gateway) => new Gateway({ ...gateway }));

        const workshops: Workshop[] = instanceData.workshops?.map((workshop) => new Workshop({ ...workshop })) || [];

        const chests: Chest[] = instanceData.chests?.map((chest) => new Chest({ ...chest })) || [];

        const restGameObjects: GameObject[] = instanceData.gameObjects?.map((gameObject) => new GameObject({ ...gameObject }, itemFactory)) || [];

        this.gameObjects = [...npcs, ...blocksFromBuildings, ...items, ...gateways, ...workshops, ...chests, ...restGameObjects];
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
