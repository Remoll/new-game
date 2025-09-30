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
import ReanimatePotion from "@/gameObject/item/touchable/reanimatePotion/ReanimatePotion";
import FireWand from "@/gameObject/item/projectile/fireWand/FireWand";
import Workshop from "@/gameObject/workshop/Workshop";

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

        const npcs: Npc[] = instanceData.npcs.map((npcData) => new Npc({ fields, ...npcData }));

        const buildings: Building[] = instanceData.buildingsCoordinates.map((buildingCoordinates) => new Building(fields, buildingCoordinates));
        const blocksFromBuildings: (Block | Door)[] = buildings.flatMap((building) => building.getBlocks());

        const items: Item[] = instanceData.items.map((itemData) => {
            switch (itemData.type) {
                case "reanimatePotion":
                    return new ReanimatePotion({ fields, ...itemData });
                case "fireWand":
                    return new FireWand({ fields, ...itemData });
                default:
                    throw new Error(`Unknown item type: ${itemData.type}`);
            }
        });

        const gateways: Gateway[] = instanceData.gateways.map((gateway) => new Gateway({ fields, ...gateway }));

        const workshops: Workshop[] = instanceData.workshops?.map((workshop) => new Workshop({ fields, ...workshop })) || [];

        this.gameObjects = [...npcs, ...blocksFromBuildings, ...items, ...gateways, ...workshops];
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
