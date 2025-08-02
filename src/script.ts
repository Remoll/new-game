import Game from "game/Game";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    const game = new Game(root);
    console.log("Game instance created:", game);
  } else {
    console.error("Root element not found");
  }
});

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
