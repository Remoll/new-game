import { Direction, DispositionToFactions, EntityAttributes, Faction } from "@/gameObject/types";
import { emitAttack, emitDead, emitMove, emitWait } from "@/gameEvents/emiter/emittedActions";
import { GameObjectSelector } from "@/gameEvents/types";
import GameObject from "@/gameObject/GameObject";

class Entity extends GameObject {
    private hp: number;
    private faction: Faction;
    private dispositionToFactions: DispositionToFactions;
    private isReanimate: boolean = false;

    constructor(attributes: EntityAttributes) {
        const { hp, faction, dispositionToFactions, ...gameObjectAttributes } = attributes;

        super(gameObjectAttributes);

        this.hp = hp;
        this.faction = faction;
        this.dispositionToFactions = dispositionToFactions;
    }

    getHp(): number {
        return this.hp;
    }

    getFaction() {
        return this.faction;
    }

    getDispositionToFactions() {
        return this.dispositionToFactions;
    }

    takeDamage(value: number) {
        this.hp -= value;
        if (this.hp <= 0) {
            this.die();
        }
    }

    private die() {
        this.hp = 0;
        this.setCanOccupiedFields(false);
        emitDead(this, { type: this.getType() });
    }

    isAlive() {
        return this.hp > 0;
    }

    addToCanvas(ctx: CanvasRenderingContext2D) {
        const { x, y } = this.getPosition();

        ctx.fillStyle = this.isAlive() ? "#ff0000ff" : "#444444";
        ctx.fillRect(x * 50, y * 50, 50, 50);  // x, y, width, height

        if (this.isAlive()) {
            ctx.fillStyle = "#c3ff00ff";
            ctx.fillText(`${this.hp}`, x * 50, y * 50);
        }
    }

    // TODO: check if it's needed
    private checkIsFieldAvailable(x: number, y: number): boolean {
        const field = this.getFieldFromCoordinates(x, y);
        if (!field) {
            console.log("No field from coordinates");
            return false;
        }

        return !field.getIsOccupied();
    }

    private attackEntity(entity: Entity) {
        emitAttack(this, { id: entity.id }, 10)
    }

    protected move(newX: number, newY: number) {
        const initialX = this.x;
        const initialY = this.y;

        this.x = newX;
        this.y = newY;

        const oldField = this.getFieldFromCoordinates(initialX, initialY);
        oldField.removeGameObjectFromField(this);

        const newField = this.getCurrentField();
        newField.addGameObjectToField(this);

        emitMove(this, { type: "enemy" })
    }

    protected takeAction(direction: Direction) {
        const { x: newX, y: newY } = this.findNewCoordinatesFromDirection(direction);

        let entityToAttack: GameObject | undefined = undefined;

        const field = this.getFieldFromCoordinates(newX, newY);

        if (field) {
            entityToAttack = field.getGameObjectThatOccupiedField();
        }

        if (entityToAttack && entityToAttack instanceof Entity) {
            this.attackEntity(entityToAttack);
            return;
        }

        if (!this.checkIsFieldAvailable(newX, newY)) {
            console.log("fieldOccupied, can't move")
            return;
        }

        this.move(newX, newY);
    }

    protected wait() {
        emitWait(this, { type: "enemy" })
    }

    findShortestPath(targetX: number, targetY: number) {
        // quick checks
        const startKey = `${this.x},${this.y}`;
        const targetKey = `${targetX},${targetY}`;

        // build a lookup for fields by "x,y"
        const fieldMap = new Map();
        this.fields.forEach((field) => {
            const { x: fieldX, y: fieldY } = field.getPosition()
            return fieldMap.set(`${fieldX},${fieldY}`, field)
        });

        if (!fieldMap.has(targetKey)) {
            // target is off-map
            return null;
        }

        if (startKey === targetKey) {
            return []; // already at player
        }

        const queue = [startKey];
        const visited = new Set([startKey]);
        const parent = new Map();

        const directions = [
            [1, 0], // right
            [-1, 0], // left
            [0, 1], // down
            [0, -1], // up
        ];

        while (queue.length > 0) {
            const key = queue.shift();
            const [cx, cy] = key.split(",").map(Number);

            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;
                const nKey = `${nx},${ny}`;

                if (visited.has(nKey)) continue;
                if (!fieldMap.has(nKey)) continue; // out of map

                const field = fieldMap.get(nKey);

                // If the neighbor is occupied and it's NOT the player's cell, skip it.
                // (We allow stepping into the player's cell even if it's occupied by the player.)
                if (field.getIsOccupied() && !(nx === targetX && ny === targetY)) {
                    continue;
                }

                visited.add(nKey);
                parent.set(nKey, key);

                // Found player — reconstruct path
                if (nKey === targetKey) {
                    const path = [];
                    let cur = nKey;
                    while (cur && cur !== startKey) {
                        const [px, py] = cur.split(",").map(Number);
                        path.push([px, py]);
                        cur = parent.get(cur);
                    }
                    path.reverse();
                    return path; // array of [x,y] steps (first step is the next move)
                }

                queue.push(nKey);
            }
        }

        // no path
        return null;
    }

    protected takeActionToDirectionFromCoordinates(nextX: number, nextY: number) {
        let direction: Direction;

        if (nextX > this.x) {
            direction = Direction.RIGHT;
        } else if (nextX < this.x) {
            direction = Direction.LEFT;
        } else if (nextY > this.y) {
            direction = Direction.DOWN;
        } else if (nextY < this.y) {
            direction = Direction.UP;
        }

        this.takeAction(direction);
    }

    findNearestGameObject(target: GameObjectSelector, checkIsAlive: boolean = false): GameObject | null {
        let nearestGameObject: GameObject | null = null;
        let minDistance = Infinity;

        this.fields.forEach((field) => {
            const gameObjects = field.getGameObjectsFromField();

            gameObjects.forEach((gameObject) => {
                if (gameObject.getId() === this.getId()) return;

                const isGameObjectInSelectedFaction = "factions" in target && target.factions.some((faction) => {
                    if (gameObject instanceof Entity === false) {
                        return false;
                    }
                    return gameObject.getFaction() === faction
                });
                const isGameObjectTypeInTarget = "type" in target && target.type && gameObject.getType() === target.type;
                const isGameObjectIdInTarget = "id" in target && target.id && gameObject.getId() === target.id;

                if ((!checkIsAlive || (gameObject instanceof Entity && gameObject.isAlive())) && (isGameObjectInSelectedFaction || isGameObjectTypeInTarget || isGameObjectIdInTarget)) {
                    const { x: gameObjectX, y: gameObjectY } = gameObject.getPosition();
                    const distance = Math.abs(this.x - gameObjectX) + Math.abs(this.y - gameObjectY); // Manhattan distance

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestGameObject = gameObject;
                    }
                }
            });
        });

        return nearestGameObject;
    }

    setFaction(faction: Faction): void {
        this.faction = faction;
    }

    setDispositionToFactions(factions: DispositionToFactions): void {
        this.dispositionToFactions = factions;
    }

    setHp(hp: number): void {
        this.hp = hp;
    }

    setIsReanimate(isReanimate: boolean): void {
        this.isReanimate = isReanimate;
    }
}

export default Entity;
