import { Disposition, Faction } from "@/gameObject/types";
import { ImageKey } from "@/imageManager/types";
import { InstanceData, InstanceKey } from "./types";

const instanceData: InstanceData = {
    mapSize: {
        width: 30,
        height: 7
    },
    playerStart: { x: 1, y: 5 },
    buildingsCoordinates: [
        {
            topLeft: {
                x: 0,
                y: 0
            },
            bottomRight: {
                x: 7,
                y: 4
            },
            doors: [{
                coordinates: {
                    x: 3,
                    y: 4
                },
                isClosed: false
            }]
        },
        {
            topLeft: {
                x: 9,
                y: 0
            },
            bottomRight: {
                x: 16,
                y: 4
            },
            doors: [{
                coordinates: {
                    x: 12,
                    y: 4
                },
                isClosed: false
            }]
        },
        {
            topLeft: {
                x: 20,
                y: 0
            },
            bottomRight: {
                x: 20,
                y: 6
            },
            doors: [{
                coordinates: {
                    x: 20,
                    y: 3
                },
                isClosed: true
            }]
        },
    ],
    npcs: [
        { speed: 1, type: "enemy", x: 10, y: 1, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
        { speed: 1, type: "enemy", x: 13, y: 1, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
    ],
    items: [],
    gateways: [
        { targetInstanceKey: InstanceKey.INSTANCE_03, type: "gateway", x: 29, y: 5, imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY }, canOccupiedFields: false, isInteractive: true }
    ]
};

export default instanceData;

