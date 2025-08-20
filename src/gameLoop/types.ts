import Entity from "entity/Entity";
import { GameEvent } from "events/types";

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