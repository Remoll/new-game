import { Direction, DispositionToFactions, EntityAttributes, Faction } from "@/gameObject/types";
import { emitAttack, emitDead, emitMove, emitWait } from "@/gameEvents/emiter/emittedActions";
import { GameObjectSelector } from "@/gameEvents/types";
import GameObject from "@/gameObject/GameObject";
import ImageManager from "@/imageManager/ImageManager";

class Entity extends GameObject {
    private initialHp: number;
    private hp: number;
    private faction: Faction;
    private dispositionToFactions: DispositionToFactions;
    private isReanimate: boolean = false;

    constructor(attributes: EntityAttributes) {
        const { hp, faction, dispositionToFactions, ...gameObjectAttributes } = attributes;

        super(gameObjectAttributes);

        this.initialHp = hp;
        this.hp = hp;
        this.faction = faction;
        this.dispositionToFactions = dispositionToFactions;
    }

    getInitialHp(): number {
        return this.initialHp;
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

    async addToCanvas(ctx: CanvasRenderingContext2D) {
        const { x, y } = this.getPosition();

        ctx.drawImage(ImageManager.instance.getImage(this.isAlive() ? this.getImagesKeys().default : this.getImagesKeys().dead), x * 50, y * 50)

        if (this.isAlive()) {
            ctx.fillStyle = "#c3ff00ff";
            ctx.fillText(`${this.getHp()}`, x * 50, y * 50);
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
        // Helper to check if field is available for movement
        const isFieldAvailable = (x: number, y: number, ignoreEntities = false): boolean => {
            if (targetX === x && targetY === y) {
                return true;
            }
            const field = this.getFieldFromCoordinates(x, y);
            if (!field) return false;
            if (field.getIsOccupied()) {
                const obj = field.getGameObjectThatOccupiedField();
                if (obj && obj instanceof Entity) {
                    // If ignoring entities, allow passing through them
                    return ignoreEntities;
                }
                // Block/building blocks path
                return false;
            }
            return true;
        };

        // BFS function
        const bfs = (ignoreEntities: boolean): number[][] | null => {
            const start = { x: this.x, y: this.y };
            const queue: Array<{ x: number, y: number, path: number[][] }> = [
                { x: start.x, y: start.y, path: [] }
            ];
            const visited = new Set<string>();
            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            while (queue.length > 0) {
                const { x, y, path } = queue.shift()!;
                const key = `${x},${y}`;
                if (visited.has(key)) continue;
                visited.add(key);

                if (x === targetX && y === targetY) {
                    return path;
                }

                for (const { dx, dy } of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    const nkey = `${nx},${ny}`;
                    if (visited.has(nkey)) continue;
                    if (!isFieldAvailable(nx, ny, ignoreEntities)) continue;
                    queue.push({ x: nx, y: ny, path: [...path, [nx, ny]] });
                }
            }
            return null;
        };

        // First, try to find a path avoiding entities
        const pathAvoidingEntities = bfs(false);
        if (pathAvoidingEntities) return pathAvoidingEntities;
        // If not found, try again allowing movement through entities
        return bfs(true);
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
