import { Coordinates } from "@/types";

class GameState {
    private static fieldSize: number = 50;
    private static gameMapWidth: number = 21;
    private static gameMapHight: number = 21;
    private static viewRange: number = 10;
    private static playerAndCenterDifference: Coordinates = { x: null, y: null };

    static getFieldSize(): number {
        return this.fieldSize;
    }

    static getGameMapWidth(): number {
        return this.gameMapWidth;
    }

    static getGameMapHight(): number {
        return this.gameMapHight;
    }

    static getViewRange(): number {
        return this.viewRange;
    }

    static getPlayerAndCenterDifference(): Coordinates {
        return this.playerAndCenterDifference;
    }

    static setPlayerAndCenterDifference(playerAndCenterDifference: Coordinates): void {
        this.playerAndCenterDifference = playerAndCenterDifference;
    }
}

export default GameState;