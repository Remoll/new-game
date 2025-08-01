class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.occupied = false;
    this.occupiedBy = null;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toggleOccupied(value, occupiedBy = null) {
    this.occupied = value;
    this.occupiedBy = value ? occupiedBy : null;
  }

  getHtml() {
    return `<div class="game_object field ${
      this.occupied ? "field--occupied" : ""
    }" style="top: ${this.y * 25}px; left: ${this.x * 25}px" data-x="${
      this.x
    }" data-y="${this.y}"></div>`;
  }
}

class Map {
  constructor() {
    this.fields = this.generateFields();
  }

  generateFields() {
    const map = [];
    const xLength = 50;
    const yLength = 20;
    for (let i = 0; i < xLength; i++) {
      for (let j = 0; j < yLength; j++) {
        map.push(new Field(i, j));
      }
    }
    return map;
  }

  getFields() {
    return this.fields;
  }

  generateHTMLMap() {
    const htmlMap = this.fields
      .map((field) => {
        return field.getHtml();
      })
      .join("");

    return htmlMap;
  }
}

class Entity {
  constructor(mapElement, fields, type = "entity", x = 0, y = 0) {
    this.mapElement = mapElement;
    this.fields = fields;
    this.type = type;
    this.id = this.generateId(type);
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.speed = 1;

    this.spawnOnMap();
  }

  generateId(type) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${type}-${timestamp}-${randomPart}`;
  }

  takeDamage(value) {
    if (this.hp <= 0) {
      this.die();
      return;
    }
    this.hp -= value;
    this.resetPosition();
  }

  die() {
    this.hp = 0;
    this.removeFromMap();
    GameEventEmitter.emit("died", this, { type: this.type });
  }

  getHtml(x, y) {
    return `<div id="${this.id}" class="game_object ${this.type}" style="top: ${
      y * 25
    }px; left: ${x * 25}px" data-x="${x}" data-y="${y}">
    
      <span class="hp_bar">${this.hp}</span>
    </div>`;
  }

  spawnOnMap() {
    const entity = this.getHtml(this.x, this.y);

    const isFieldAvailable = this.checkIsFieldAvailable(this.x, this.y);

    if (this.mapElement && isFieldAvailable) {
      this.mapElement.innerHTML += entity;
    }

    this.setIsOccupied(this.x, this.y, true);
  }

  removeFromMap() {
    const existingEntity = document.getElementById(this.id);
    if (existingEntity) {
      existingEntity.remove();
    }
    this.setIsOccupied(this.x, this.y, false);
  }

  resetPosition() {
    this.removeFromMap();
    this.spawnOnMap();
  }

  checkIsFieldAvailable(x, y) {
    return this.fields.some((field) => {
      const fieldPosition = field.getPosition();
      return fieldPosition.x === x && fieldPosition.y === y && !field.occupied;
    });
  }

  setIsOccupied(x, y, value) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    if (field) {
      field.toggleOccupied(value, this);
    }
  }

  getPlayerPosition() {
    const element = document.getElementsByClassName("player")[0];
    if (element) {
      return {
        x: parseInt(element.dataset.x, 10),
        y: parseInt(element.dataset.y, 10),
      };
    }
    return null;
  }

  attackElement(element) {
    GameEventEmitter.emit("attack", this, { id: element.id }, 10);
  }

  getElementOccupiedField(x, y) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    return field && field.occupiedBy;
  }

  move(axis, direction) {
    const initialX = this.x;
    const initialY = this.y;
    const newX = axis === "x" ? this.x + direction : this.x;
    const newY = axis === "y" ? this.y + direction : this.y;

    const elementOccupiedField = this.getElementOccupiedField(newX, newY);
    if (elementOccupiedField) {
      this.attackElement(elementOccupiedField);
      return;
    }

    if (!this.checkIsFieldAvailable(newX, newY)) {
      return;
    }

    this[axis] += direction;
    this.resetPosition();
    this.setIsOccupied(initialX, initialY, false);
    this.setIsOccupied(newX, newY, true);

    GameEventEmitter.emit(
      "moved",
      this,
      { type: "enemy" },
      {
        x: this.x,
        y: this.y,
      }
    );
  }

  moveLeft() {
    this.move("x", -this.speed);
  }
  moveRight() {
    this.move("x", this.speed);
  }
  moveUp() {
    this.move("y", -this.speed);
  }
  moveDown() {
    this.move("y", this.speed);
  }
}

class Enemy extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "enemy", x, y);
  }

  chargePlayer() {
    if (this.hp <= 0) {
      return;
    }
    const playerPosition = this.getPlayerPosition();
    if (!playerPosition) return;
    const { x: playerX, y: playerY } = playerPosition || {};
    if (!playerX || !playerY) return;

    if (this.x < playerX) {
      this.moveRight();
    } else if (this.x > playerX) {
      this.moveLeft();
    } else if (this.y < playerY) {
      this.moveDown();
    } else if (this.y > playerY) {
      this.moveUp();
    }
  }
}

class Player extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "player", x, y);
    this.hp = 200;
    this.resetPosition();
    this.addMoveListener();
  }

  addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "ArrowUp":
          this.moveUp();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case " ":
          return;
        default:
          return; // Exit if not an arrow key
      }
    });
  }
}

class Wall extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "wall", x, y);
  }
}

// class GameLoop {
//   constructor(map, entities) {
//     this.map = map;
//     this.entities = entities;

//     document.addEventListener("enemyattack", () => {
//       console.log("player was attacked");
//     });

//     document.addEventListener("playerattack", () => {
//       console.log("enemy was attacked");
//     });
//   }

//   getPlayer() {
//     return this.entities.find((entity) => entity.name === "player");
//   }

//   getEnemy() {
//     return this.entities.find((entity) => entity.name === "enemy");
//   }
// }

class GameEventEmitter {
  static emit(type, sender, target, value) {
    const evt = new CustomEvent(type, {
      detail: {
        type,
        sender,
        target,
        value,
      },
    });
    document.dispatchEvent(evt);
  }
}

// interface GameEvent {
//   type: "attack",
//   sender: player,
//   target: { type: "enemy", id: "enemy-123" },
//   value: 5,
// }

class GameEventListener {
  constructor(entities) {
    this.entities = entities;
    this.listenToEvents();
  }

  handleAttack(targetEntity, sender, value) {
    targetEntity.takeDamage(value);
    if (sender.type === "player") {
      targetEntity.chargePlayer();
    }
  }

  handleMove(enemy, sender) {
    if (sender.type === "player") {
      enemy.chargePlayer();
    }
  }

  affectTarget(eventDetail) {
    const { type, sender, target, value } = eventDetail;
    const targetType = target.type;
    const targetId = target.id;
    const affectedEntities = this.entities.filter(
      (entity) => entity.type === targetType || entity.id === targetId
    );

    affectedEntities.forEach((entity) => {
      switch (type) {
        case "attack":
          this.handleAttack(entity, sender, value, eventDetail);
          break;

        case "moved":
          this.handleMove(entity, sender, value, eventDetail);
          break;

        default:
          break;
      }
    });
  }

  listenToEvents() {
    document.addEventListener("attack", (event) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener("moved", (event) => {
      this.affectTarget(event.detail);
    });
  }
}

class Game {
  constructor(root) {
    this.map = [];
    this.players = [];
    this.root = root || document.getElementById("root");

    this.initGame();
  }

  initGame() {
    if (this.root) {
      const map = new Map();

      const htmlMap = map.generateHTMLMap();

      const container = `<h1>Welcome to the Tactical Marines Naval Game</h1><div id="map" class="map">${htmlMap}</div>`;

      this.root.innerHTML = container;

      const mapElement = document.getElementById("map");

      if (!mapElement) {
        console.error("Map element not found");
        return;
      }

      let walls = [];

      const initialX = 2;
      const length = 6;

      for (let i = initialX; i < initialX + length; i++) {
        const yTop = 3;
        const yBottom = 8;
        walls.push(new Wall(mapElement, map.getFields(), i, yTop));
        walls.push(new Wall(mapElement, map.getFields(), i, yBottom));
      }

      const player = new Player(mapElement, map.getFields(), 1, 1);

      console.log("player: ", player);

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemy = new Enemy(mapElement, map.getFields(), 5, 5);

      console.log("enemy: ", enemy);

      if (!enemy) {
        console.error("Enemy not created");
        return;
      }

      const entities = [player, enemy, ...walls];

      const gameEventListener = new GameEventListener(entities);

      console.log("Event listener initialized:", gameEventListener);

      // const gameLoop = new GameLoop(map, entities);

      // console.log("Game loop initialized:", gameLoop);

      console.log("Game initialized");
    } else {
      console.error("Root element not found");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    const game = new Game(root);
    console.log("Game instance created:", game);
  } else {
    console.error("Root element not found");
  }
});
