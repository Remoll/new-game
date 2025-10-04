import {
  Direction,
  Disposition,
  DispositionToFactions,
  EntityAttributes,
  Faction,
} from '@/gameObject/types.ts';
import {
  emitAttack,
  emitDead,
  emitMove,
  emitWait,
} from '@/gameEvents/emiter/emittedActions.ts';
import { GameObjectSelector } from '@/gameEvents/types.ts';
import GameObject from '@/gameObject/GameObject.ts';
import ImageManager from '@/imageManager/ImageManager.ts';
import { Coordinates } from '@/types.ts';
import GameState from '@/game/GameState.ts';
import itemFactory from '../item/itemFactory.ts';
import { EquipmentSlot } from '../item/equipment/types.ts';
import Equipment from '../item/equipment/Equipment.ts';

class Entity extends GameObject {
  private initialHp: number;
  private hp: number;
  private faction: Faction;
  private dispositionToFactions: DispositionToFactions;
  private speed: number;
  private isReanimate: boolean = false;
  private visibleEnemies: Entity[] = [];
  private focusedEnemy: Entity | null = null;
  private equipments: Record<EquipmentSlot, Equipment> = {
    [EquipmentSlot.MAIN_HAND]: null,
  };

  constructor(attributes: EntityAttributes) {
    const { hp, faction, dispositionToFactions, ...gameObjectAttributes } =
      attributes;

    super(gameObjectAttributes, itemFactory);

    this.initialHp = hp;
    this.hp = hp;
    this.faction = faction;
    this.dispositionToFactions = dispositionToFactions;
    this.speed = attributes.speed;
  }

  equipItem(equipment: Equipment) {
    const equipmentSlot = equipment.getSlot();
    this.equipments[equipmentSlot] = equipment;
  }

  getEquipments(): Record<EquipmentSlot, Equipment> {
    return this.equipments;
  }

  getEquipmentBySlot(slot: EquipmentSlot): Equipment {
    return this.getEquipments()[slot];
  }

  getSpeed(): number {
    return this.speed;
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

  findEntitiesInRange(): Entity[] {
    const { x: entityX, y: entityY } = this.getPosition();
    const viewRange = GameState.getViewRange();
    const entitiesInViewRange: Entity[] = [];

    for (let x = entityX - viewRange; x <= entityX + viewRange; x++) {
      for (let y = entityY - viewRange; y <= entityY + viewRange; y++) {
        const field = this.getFieldFromCoordinates(x, y);
        if (!field) continue;

        const gameObjectThatOccupiedField =
          field.getGameObjectThatOccupiedField();

        if (
          gameObjectThatOccupiedField &&
          gameObjectThatOccupiedField instanceof Entity &&
          gameObjectThatOccupiedField.isAlive() &&
          gameObjectThatOccupiedField !== this
        ) {
          entitiesInViewRange.push(gameObjectThatOccupiedField);
        }
      }
    }

    return entitiesInViewRange;
  }

  findVisibleEnemies(): void {
    const entitiesInRange = this.findEntitiesInRange();

    const visibleEntities = entitiesInRange.filter((entityInRange) => {
      const { x: entityX, y: entityY } = entityInRange.getPosition();
      const { x: npcX, y: npcY } = this.getPosition();

      const result = GameState.hasLineOfSight(npcX, npcY, entityX, entityY, {
        justBlocks: true,
      });

      return result.clear;
    });

    const hostileFactions =
      this.getDispositionToFactions()?.[Disposition.HOSTILE];

    this.setVisibleEnemies(
      visibleEntities.filter(
        (entity) =>
          entity.isAlive() &&
          hostileFactions?.some((faction) => faction === entity.getFaction())
      )
    );
  }

  getFocusedEnemy(): Entity | null {
    return this.focusedEnemy;
  }

  setFocusedEnemy(entity: Entity | null) {
    this.focusedEnemy = entity;
  }

  getVisibleEnemies(): Entity[] {
    return this.visibleEnemies;
  }

  setVisibleEnemies(entities: Entity[]) {
    this.visibleEnemies = entities;
  }

  takeDamage(value: number, sender: Entity) {
    this.hp -= value;
    if (!this.getFocusedEnemy()) {
      this.setFocusedEnemy(sender);
    }
    if (this.hp <= 0) {
      this.die();
    }
  }

  private die() {
    this.hp = 0;
    this.setCanOccupiedFields(false);
    this.setFocusedEnemy(null);
    this.setVisibleEnemies([]);
    emitDead(this, { type: this.getType() });
  }

  isAlive() {
    return this.hp > 0;
  }

  async addToCanvas(
    ctx: CanvasRenderingContext2D,
    fieldShift: Coordinates,
    fieldSize: number
  ) {
    const { x, y } = this.getPosition();

    ctx.drawImage(
      ImageManager.instance.getImage(
        this.isAlive()
          ? this.getImagesKeys().default
          : this.getImagesKeys().dead
      ),
      (x - fieldShift.x) * fieldSize,
      (y - fieldShift.y) * fieldSize,
      fieldSize,
      fieldSize
    );

    if (this.isAlive()) {
      ctx.fillStyle = '#c3ff00ff';
      ctx.fillText(
        `${this.getHp()}`,
        (x - fieldShift.x) * fieldSize,
        (y - fieldShift.y) * fieldSize
      );
    }
  }

  // TODO: check if it's needed
  private checkIsFieldAvailable(x: number, y: number): boolean {
    const field = this.getFieldFromCoordinates(x, y);
    if (!field) {
      return false;
    }

    return !field.getIsOccupied();
  }

  private attackEntity(entity: Entity) {
    const attackValue = this.getEquipmentBySlot(EquipmentSlot.MAIN_HAND)
      ? 50
      : 10;
    emitAttack(this, { id: [entity.id] }, attackValue);
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

    emitMove(this, { type: 'enemy' });
  }

  protected takeAction(direction: Direction) {
    const { x: newX, y: newY } =
      this.findNewCoordinatesFromDirection(direction);

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
      return;
    }

    this.move(newX, newY);
  }

  protected wait() {
    emitWait(this, { type: 'enemy' });
  }

  findShortestPath(targetX: number, targetY: number) {
    // Helper to check if field is available for movement
    const isFieldAvailable = (
      x: number,
      y: number,
      ignoreEntities = false
    ): boolean => {
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
      const queue: Array<{ x: number; y: number; path: number[][] }> = [
        { x: start.x, y: start.y, path: [] },
      ];
      const visited = new Set<string>();
      const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
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

  findNearestGameObject(
    target: GameObjectSelector,
    checkIsAlive: boolean = false
  ): GameObject | null {
    let nearestGameObject: GameObject | null = null;
    let minDistance = Infinity;

    const fields = GameState.getFields();

    fields.forEach((field) => {
      const gameObjects = field.getGameObjectsFromField();

      gameObjects.forEach((gameObject) => {
        if (gameObject.getId() === this.getId()) return;

        const isGameObjectInSelectedFaction =
          'factions' in target &&
          target.factions.some((faction) => {
            if (gameObject instanceof Entity === false) {
              return false;
            }
            return gameObject.getFaction() === faction;
          });
        const isGameObjectTypeInTarget =
          'type' in target &&
          target.type &&
          gameObject.getType() === target.type;
        const isGameObjectIdInTarget =
          'id' in target &&
          target.id.some((id) => {
            return gameObject.getId() === id;
          });

        if (
          (!checkIsAlive ||
            (gameObject instanceof Entity && gameObject.isAlive())) &&
          (isGameObjectInSelectedFaction ||
            isGameObjectTypeInTarget ||
            isGameObjectIdInTarget)
        ) {
          const { x: gameObjectX, y: gameObjectY } = gameObject.getPosition();
          const distance =
            Math.abs(this.x - gameObjectX) + Math.abs(this.y - gameObjectY); // Manhattan distance

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
