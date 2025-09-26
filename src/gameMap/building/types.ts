import { Coordinates } from "@/types";

interface BuildingCoordinates {
	topLeft: Coordinates,
	bottomRight: Coordinates
	doors: { isClosed: boolean, coordinates: Coordinates }[] | null;
}

interface GenerateRandomBuildingsCoordinatesOptions {
	count: number;
	mapWidth: number;
	mapHeight: number;
	minWidth: number;
	maxWidth: number;
	minHeight: number;
	maxHeight: number;
}

export type { BuildingCoordinates, GenerateRandomBuildingsCoordinatesOptions };
