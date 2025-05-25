const canvas = document.getElementById('matrix-background');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initMatrix();
});

const letters = 'アァイィウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
const fontSize = 20;
let columns, drops;

function initMatrix() {
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1);
}
initMatrix();

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ff00';
  ctx.font = `${fontSize}px monospace`;
  ctx.shadowColor = '#00ff00';
  ctx.shadowBlur = 12;

  drops.forEach((y, x) => {
    const char = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(char, x * fontSize, y * fontSize);

    if (y * fontSize > canvas.height && Math.random() > 0.975) {
      drops[x] = 0;
    }

    drops[x]++;
  });

  ctx.shadowBlur = 0;
}

setInterval(drawMatrix, 40);
