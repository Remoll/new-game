import { BuildingCoordinates } from "@/gameMap/building/types";
import { EntityAttributes, GameObjectAttributes, GatewayAttributes } from "@/gameObject/types";

interface InstanceData {
    mapSize: { width: number, height: number };
    buildingsCoordinates: BuildingCoordinates[];
    npcs: Omit<EntityAttributes, 'fields'>[];
    items: Omit<GameObjectAttributes, 'fields'>[];
    gateways: Omit<GatewayAttributes, 'fields'>[];
    workshops?: Omit<GameObjectAttributes, 'fields'>[];
}

enum InstanceKey {
    INSTANCE_01 = 'instance01',
    INSTANCE_02 = 'instance02',
    INSTANCE_03 = 'instance03',
}

export { type InstanceData, InstanceKey };
