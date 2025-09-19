import { Coordinates } from "@/types";

interface BuildingCoordinates {
	topLeft: Coordinates,
	bottomRight: Coordinates
	door: { isClosed: boolean, coordinates: Coordinates } | null;
}

export type { BuildingCoordinates };
