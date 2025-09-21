enum ImageKey {
    PLAYER = "player",
    ENEMY = "enemy",
    POTION = "potion",
    DEAD_ENEMY = "deadEnemy",
    FLOOR = "floor",
    BLOCK = "block",
    DOOR_CLOSED = "doorClosed",
    DOOR_OPEN = "doorOpen"
}

type ImageMap = {
    [key in ImageKey]: HTMLImageElement;
};

export { ImageKey, ImageMap };
