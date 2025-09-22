enum ImageKey {
    PLAYER = "player",
    PLAYER_DEAD = "playerDead",
    ENEMY = "enemy",
    ENEMY_DEAD = "enemyDead",
    POTION = "potion",
    FLOOR = "floor",
    BLOCK = "block",
    DOOR_CLOSED = "doorClosed",
    DOOR_OPEN = "doorOpen",
    SCROLL = "scroll",
    FIRE_ORB = "fireOrb",
}

type ImageMap = {
    [key in ImageKey]: HTMLImageElement;
};

export { ImageKey, ImageMap };
