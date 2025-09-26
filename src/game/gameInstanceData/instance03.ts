import { ImageKey } from "@/imageManager/types";
import { InstanceData, InstanceKey } from "./types";
import Building from "@/gameMap/building/Building";

const instanceData: InstanceData = {
    mapSize: {
        width: 50,
        height: 50
    },
    playerStart: { x: 5, y: 5 },
    buildingsCoordinates: Building.generateRandomBuildingsCoordinates({
        count: 15,
        mapWidth: 50,
        mapHeight: 50,
        minWidth: 5,
        maxWidth: 20,
        minHeight: 5,
        maxHeight: 20
    }),
    npcs: [],
    items: [],
    gateways: [
        { targetInstanceKey: InstanceKey.INSTANCE_01, type: "gateway", x: 29, y: 5, imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY }, canOccupiedFields: false, isInteractive: true }
    ]
};

export default instanceData;

