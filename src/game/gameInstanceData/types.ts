import { BuildingCoordinates } from "@/gameMap/building/types";
import { EntityAttributes, GameObjectAttributes, GatewayAttributes } from "@/gameObject/types";

interface InstanceData {
    mapSize: { width: number, height: number };
    buildingsCoordinates: BuildingCoordinates[];
    npcs: EntityAttributes[];
    items: GameObjectAttributes[];
    gateways: GatewayAttributes[];
    workshops?: GameObjectAttributes[];
    chests?: GameObjectAttributes[];
    gameObjects?: GameObjectAttributes[];
}

enum InstanceKey {
    INSTANCE_01 = 'instance01',
    INSTANCE_02 = 'instance02',
    INSTANCE_03 = 'instance03',
    INN = 'inn',
}

export { type InstanceData, InstanceKey };
