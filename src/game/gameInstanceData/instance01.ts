import { Disposition, Faction } from "@/gameObject/types";
import { ImageKey } from "@/imageManager/types";
import { InstanceData, InstanceKey } from "./types";

const instanceData: InstanceData = {
    mapSize: {
        width: 21,
        height: 21
    },
    playerStart: { x: 1, y: 1 },
    buildingsCoordinates: [
        {
            topLeft: {
                x: 3,
                y: 3
            },
            bottomRight: {
                x: 17,
                y: 17
            },
            doors: [{
                coordinates: {
                    x: 6,
                    y: 3
                },
                isClosed: false
            }]
        }
    ],
    npcs: [
        { speed: 3, type: "dog", x: 5, y: 5, imagesKeys: { default: ImageKey.DOG, dead: ImageKey.DOG_DEAD }, faction: Faction.ENEMY, hp: 150, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
        { speed: 1, type: "enemy", x: 7, y: 7, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
        { speed: 1, type: "enemy", x: 10, y: 5, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
        { speed: 1, type: "enemy", x: 11, y: 6, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
        { speed: 1, type: "enemy", x: 18, y: 18, imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD }, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER], [Disposition.FRIENDLY]: [Faction.ENEMY], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false },
    ],
    items: [
        { type: "reanimatePotion", x: 1, y: 2, imagesKeys: { default: ImageKey.POTION, dead: ImageKey.POTION }, canOccupiedFields: false, isInteractive: true },
        { type: "fireBallScroll", x: 2, y: 1, imagesKeys: { default: ImageKey.SCROLL, dead: ImageKey.SCROLL }, canOccupiedFields: false, isInteractive: true },
    ],
    gateways: [
        { targetInstanceKey: InstanceKey.INSTANCE_02, type: "gateway", x: 1, y: 5, imagesKeys: { default: ImageKey.GATEWAY, dead: ImageKey.GATEWAY }, canOccupiedFields: false, isInteractive: true }
    ]
};

export default instanceData;

