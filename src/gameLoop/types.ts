import Entity from "entity/Entity";

interface IEntitiesActions {
    entityId: string;
    entityType: string;
    action: (...args) => any;
}

interface IGameLoop {
    entities: Entity[];
    entitiesActions: IEntitiesActions[];
    executeTurn: () => void;
    addEntityAction: (IEntitiesActions) => void;
    resetEntitiesActions: () => void;
}

export { IGameLoop, IEntitiesActions }