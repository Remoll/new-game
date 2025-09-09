interface BuildingCoordinates {
	topLeft: { x: number, y: number },
	bottomRight: { x: number, y: number }
	door: { isClosed: boolean, x: number, y: number } | null;
}

export type { BuildingCoordinates };
