class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.occupied = false;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  toggleOccupied() {
    this.occupied = !this.occupied;
  }

  getHtml() {
    return `<div class="field ${
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
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
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

class Player {
  constructor(mapElement, fields, x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.mapElement = mapElement;
    this.fields = fields;

    this.spawnOnMap();
    this.addMoveListener();
  }

  getHtml(x, y) {
    return `<div id="player" class="player" style="top: ${y * 25}px; left: ${
      x * 25
    }px" data-x="${x}" data-y="${y}"></div>`;
  }

  spawnOnMap() {
    const player = this.getHtml(this.x, this.y);

    if (this.mapElement) {
      this.mapElement.innerHTML += player;
    }
  }

  changePosition() {
    const existingPlayer = document.getElementById("player");

    if (existingPlayer) {
      existingPlayer.remove();
    }

    this.spawnOnMap();
  }

  checkIsFieldAvailable(x, y) {
    return this.fields.some((field) => {
      const fieldPosition = field.getPosition();
      return fieldPosition.x === x && fieldPosition.y === y && !field.occupied;
    });
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
      }
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
      if (mapElement) {
        const player = new Player(mapElement, map.getFields(), 1, 1);
        console.log("player: ", player);
      }

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
