enum ImageKey {
    PLAYER = "player",
    PLAYER_DEAD = "playerDead",
    ENEMY = "enemy",
    ENEMY_DEAD = "enemyDead",
    POTION = "potion",
    STONE_BLOCK_LIGHT = "stoneBlockLight",
    STONE_BLICK_DARK = "stoneBlockDark",
    DOOR_CLOSED = "doorClosed",
    DOOR_OPEN = "doorOpen",
    SCROLL = "scroll",
    FIRE_ORB = "fireOrb",
    GATEWAY = "gateway",
    DOG = "dog",
    DOG_DEAD = "dogDead",
    GRASS_BLOCK = "grassBlock",
    FIRE_ELEMENTAL = "fireElemental",
    LABORATORY = "laboratory",
    FIRE_WAND = "fireWand",
    PILE_OF_DUST = "pileOfDust",
    WAND = "wand",
    WIZARD = "wizard",
    WIZARD_DEAD = "wizardDead",
    ICE_ORB = "iceOrb",
    CHEST = "chest",
}

type ImageMap = {
    [key in ImageKey]: HTMLImageElement;
};

export { ImageKey, ImageMap };
