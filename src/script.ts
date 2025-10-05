import Game from '@/game/Game.ts';
import ImageManager from './imageManager/ImageManager.ts';
import DialogueManager from './dialogueManager/DialogueManager.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Root element not found');
    return;
  }

  await ImageManager.getSingleton().preloadImages();
  await DialogueManager.getSingleton().preloadDialogues();

  ctx.font = '24px Arial';

  Game.getSingleton(ctx);
});

// // --- 1. Linia ---
// ctx.beginPath();
// ctx.moveTo(50, 50);   // punkt startowy
// ctx.lineTo(200, 50);  // punkt końcowy
// ctx.stroke();

// // --- 2. Prostokąt wypełniony ---
// ctx.fillStyle = "lightblue";
// ctx.fillRect(50, 80, 150, 80);  // x, y, width, height

// // --- 3. Prostokąt tylko kontur (pusty w środku) ---
// ctx.strokeStyle = "red";
// ctx.lineWidth = 3;
// ctx.strokeRect(250, 80, 150, 80);

// // --- 4. Prostokąt czyszczący fragment (przezroczysty) ---
// ctx.clearRect(270, 100, 50, 40);

// // --- 5. Okrąg (pełny) ---
// ctx.beginPath();
// ctx.arc(150, 250, 50, 0, 2 * Math.PI); // x, y, r, startAngle, endAngle
// ctx.fillStyle = "green";
// ctx.fill();

// // --- 6. Okrąg (tylko obwód) ---
// ctx.beginPath();
// ctx.arc(300, 250, 50, 0, 2 * Math.PI);
// ctx.strokeStyle = "blue";
// ctx.stroke();

// // --- 7. Łuk (fragment okręgu) ---
// ctx.beginPath();
// ctx.arc(450, 250, 50, 0, Math.PI, false); // półkole
// ctx.stroke();

// // --- 8. Trójkąt ---
// ctx.beginPath();
// ctx.moveTo(450, 50);
// ctx.lineTo(550, 150);
// ctx.lineTo(350, 150);
// ctx.closePath(); // zamyka ścieżkę (wraca do startu)
// ctx.fillStyle = "orange";
// ctx.fill();

// // --- 9. Wielokąt (np. pięciokąt) ---
// ctx.beginPath();
// ctx.moveTo(100, 350);
// ctx.lineTo(150, 300);
// ctx.lineTo(200, 330);
// ctx.lineTo(190, 380);
// ctx.lineTo(120, 390);
// ctx.closePath();
// ctx.stroke();

// // --- 10. Krzywa kwadratowa (quadratic curve) ---
// ctx.beginPath();
// ctx.moveTo(250, 350);         // start
// ctx.quadraticCurveTo(300, 300, 350, 350); // controlX, controlY, endX, endY
// ctx.stroke();

// // --- 11. Krzywa Beziera (cubic bezier) ---
// ctx.beginPath();
// ctx.moveTo(400, 350);
// ctx.bezierCurveTo(420, 300, 480, 400, 520, 350);
// ctx.stroke();

// // --- 12. Tekst ---
// ctx.font = "24px Arial";
// ctx.fillStyle = "black";
// ctx.fillText("Hello Canvas!", 50, 30);
// ctx.strokeText("Outlined Text", 300, 30);
