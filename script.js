class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.occupied = false;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toggleOccupied(value) {
    this.occupied = value;
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
  constructor(mapElement, fields, name = "entity", x = 0, y = 0) {
    this.mapElement = mapElement;
    this.fields = fields;
    this.name = name;
    this.x = x;
    this.y = y;

    this.spawnOnMap();
  }

  getHtml(x, y) {
    return `<div id="${this.name}" class="game_object ${this.name}" style="top: ${
      y * 25
    }px; left: ${x * 25}px" data-x="${x}" data-y="${y}"></div>`;
  }

  spawnOnMap() {
    const entity = this.getHtml(this.x, this.y);

    if (this.mapElement) {
      this.mapElement.innerHTML += entity;
    }
  }

  changePosition() {
    const existingEntity = document.getElementById(this.name);

    if (existingEntity) {
      existingEntity.remove();
    }

    this.spawnOnMap();
  }

  checkIsFieldAvailable(x, y) {
    return this.fields.some((field) => {
      const fieldPosition = field.getPosition();
      return fieldPosition.x === x && fieldPosition.y === y && !field.occupied;
    });
  }

  toggleFieldOccupied(x, y, value = true) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    if (field) {
      field.toggleOccupied(value);
    }
  }
}

class Enemy extends Entity {
  constructor(mapElement, fields, x = 0, y = 0) {
    super(mapElement, fields, "enemy", x, y);
  }

  getPlayerPosition() {
    const playerElement = document.getElementById("player");
    if (playerElement) {
      return {
        x: parseInt(playerElement.dataset.x, 10),
        y: parseInt(playerElement.dataset.y, 10),
      };
    }
    return null;
  }

  goNearPlayer() {
    const playerPosition = this.getPlayerPosition();
    if (!playerPosition) return;

    let newPosition = { x: this.x, y: this.y };

    if (this.x < playerPosition.x) {
      newPosition.x += 1;
    } else if (this.x > playerPosition.x) {
      newPosition.x -= 1;
    } else if (this.y < playerPosition.y) {
      newPosition.y += 1;
    } else if (this.y > playerPosition.y) {
      newPosition.y -= 1;
    }

    if (
      newPosition.x === playerPosition.x &&
      newPosition.y === playerPosition.y
    ) {
      this.attackPlayer();
      return;
    }

    if (this.checkIsFieldAvailable(newPosition.x, newPosition.y)) {
      this.x = newPosition.x;
      this.y = newPosition.y;
      this.changePosition();
    }
  }

  attackPlayer() {
    console.log("Enemy is attacking the player!");
    if (
      (this.getPlayerPosition.x === this.x &&
        (this.getPlayerPosition.y === this.y - 1 ||
          this.getPlayerPosition.y === this.y + 1)) ||
      (this.getPlayerPosition.y === this.y &&
        (this.getPlayerPosition.x === this.x - 1 ||
          this.getPlayerPosition.x === this.x + 1))
    ) {
      console.log("dupa");
      const evt = new Event("enemyAttack", {
        detail: {
          value: 5,
        },
      });
      document.dispatchEvent(evt);
    }
  }
}

class Player extends Entity {
  constructor(mapElement, fields, x = 0, y = 0) {
    super(mapElement, fields, "player", x, y);
    this.addMoveListener();
  }

  addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      let newPosition = { x: this.x, y: this.y };

      switch (key) {
        case "ArrowUp":
          newPosition.y = newPosition.y - 1;
          break;
        case "ArrowDown":
          newPosition.y = newPosition.y + 1;
          break;
        case "ArrowLeft":
          newPosition.x = newPosition.x - 1;
          break;
        case "ArrowRight":
          newPosition.x = newPosition.x + 1;
          break;
        default:
          return; // Exit if not an arrow key
      }

      if (this.checkIsFieldAvailable(newPosition.x, newPosition.y)) {
        this.x = newPosition.x;
        this.y = newPosition.y;
        this.changePosition();

        const evt = new Event("playerMoved", {
          detail: {
            x: this.x,
            y: this.y,
          },
        });
        document.dispatchEvent(evt);
      }
    });
  }
}

class Wall extends Entity {
  constructor(mapElement, fields, x = 0, y = 0) {
    super(mapElement, fields, "wall", x, y);
    this.toggleFieldOccupied(this.x, this.y, true);
  }
}

class GameLoop {
  constructor(map, entities) {
    this.map = map;
    this.entities = entities;

    document.addEventListener("playerMoved", () => {
      this.entities.forEach((entity) => {
        if (entity instanceof Enemy) {
          entity.goNearPlayer();
        }
      });
    });

    document.addEventListener("enemyAttack", () => {
      console.log("player was attacked");
    });
  }

  getPlayer() {
    return this.entities.find((entity) => entity.name === "player");
  }

  getEnemy() {
    return this.entities.find((entity) => entity.name === "enemy");
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

      const gameLoop = new GameLoop(map, [player, enemy]);

      console.log("Game loop initialized:", gameLoop);

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
