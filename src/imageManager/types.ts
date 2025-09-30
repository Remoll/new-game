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
}

type ImageMap = {
    [key in ImageKey]: HTMLImageElement;
};

export { ImageKey, ImageMap };
