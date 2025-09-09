interface EntitiesActions {
	entityId: string;
	entityType: string;
	action: (...args: unknown[]) => unknown;
}

export { EntitiesActions }