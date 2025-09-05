enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
}

interface EntityAttributes {
    hp?: number;
    isPasive?: boolean;
    canOccupiedFields?: boolean;
    isInteractive?: boolean;
}

export { EntityAttributes, Direction };
