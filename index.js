const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const levelDisplay = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const info = document.getElementById("info");

const matchSound = document.getElementById("matchSound");
const failSound = document.getElementById("failSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const startSound = document.getElementById("startSound");

const emojiSet = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🐵", "🦁", "🐮"];
const levelConfigs = { 1: 4, 2: 6, 3: 8, 4: 10 };

let level = 1;
let moves = 0;
let flipped = [];
let matched = 0;
let time = 0;
let timeLimit = 30;
let timerInterval;
startBtn.addEventListener("click", () => {
  startSound.play(); 
  startBtn.style.display = "none";
  info.style.display = "flex";
  level = 1;
  startGame();
});

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  info.style.display = "flex";
  level = 1;
  startGame();
});

function startGame() {
  const pairCount = levelConfigs[level];
  const selectedEmojis = emojiSet.slice(0, pairCount);
  const cards = [...selectedEmojis, ...selectedEmojis];
  cards.sort(() => 0.5 - Math.random());

  board.innerHTML = "";
  moves = 0;
  time = 0;
  matched = 0;
  flipped = [];

  movesDisplay.innerText = "Moves: 0";
  timerDisplay.innerText = `Time Left: ${timeLimit}s`;
  levelDisplay.innerText = `Level: ${level}`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    const timeLeft = timeLimit - time;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      loseSound.play();
      Swal.fire({
        icon: 'error',
        title: "⏰ Time's up!",
        text: 'Game Over!',
      }).then(() => {
        resetGame();
      });
    }
  }, 1000);

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerText = "❓";
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => {
      if (card.classList.contains("flipped") || flipped.length === 2) return;

      card.classList.add("flipped");
      card.innerText = symbol;
      flipped.push(card);

      if (flipped.length === 2) {
        moves++;
        movesDisplay.innerText = `Moves: ${moves}`;

        const [first, second] = flipped;
        if (first.dataset.symbol === second.dataset.symbol) {
          matched += 2;
          flipped = [];
          matchSound.play();

          if (matched === cards.length) {
            clearInterval(timerInterval);
            winSound.play();
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: `🎉 Level ${level} Complete!`,
                text: 'Get ready for the next level!',
              }).then(() => {
                level++;
                if (level > 4) {
                  Swal.fire({
                    icon: 'success',
                    title: "🏆 Congratulations!",
                    text: "You won all 4 levels!",
                  }).then(() => {
                    resetGame();
                  });
                } else {
                  startGame();
                }
              });
            }, 500);
          }
        } else {
          failSound.play();
          setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
            first.innerText = "❓";
            second.innerText = "❓";
            flipped = [];
          }, 800);
        }
      }
    });

    board.appendChild(card);
  });
}

function resetGame() {
  level = 1;
  info.style.display = "none";
  board.innerHTML = "";
  startBtn.style.display = "inline-block";
}
