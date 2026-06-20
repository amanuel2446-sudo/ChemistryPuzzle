let level = 1;
let index = 0;
let score = 0;
let lives = 3;
let questions = [];
let timer;
let timeLeft = 30;
let answered = false;

const files = {
  1: "data/equilibrium.json",
  2: "data/kinetics.json",
  3: "data/electrochemistry.json"
};

// UI
const qEl = document.getElementById("question");
const a = document.getElementById("btnA");
const b = document.getElementById("btnB");
const c = document.getElementById("btnC");
const d = document.getElementById("btnD");
const scoreEl = document.getElementById("score");
const qNum = document.getElementById("questionNumber");

// ================= START =================
function startGame() {
  level = 1;
  score = 0;
  lives = 3;
  loadLevel();
}

// ================= LOAD LEVEL =================
function loadLevel() {
  index = 0;

  fetch(files[level])
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    })
    .catch(() => {
      qEl.textContent = "Error loading file";
    });
}

// ================= SHOW QUESTION =================
function showQuestion() {

  answered = false;

  if (index >= questions.length) {
    levelComplete();
    return;
  }

  clearInterval(timer);

  let q = questions[index];

  qEl.textContent = q.question;

  a.textContent = q.options[0];
  b.textContent = q.options[1];
  c.textContent = q.options[2];
  d.textContent = q.options[3];

  // enable buttons
  a.disabled = false;
  b.disabled = false;
  c.disabled = false;
  d.disabled = false;

  qNum.textContent =
    `EXAM MODE | Level ${level} | Q ${index + 1}/${questions.length}`;

  scoreEl.textContent =
    `⭐ Score: ${score} | ❤️ Lives: ${lives}`;

  startTimer();
}

// ================= TIMER =================
function startTimer() {

  timeLeft = 30;
  
  alert(
    "Final Score: " + score +
    "\nWell done!"
  );
}

// ================= GAME OVER =================
function gameOver() {

  clearInterval(timer);

  alert("Exam Failed! Restarting level...");

  loadLevel();
}

// ================= BUTTONS =================
a.onclick = () => checkAnswer(0);
b.onclick = () => checkAnswer(1);
c.onclick = () => checkAnswer(2);
d.onclick = () => checkAnswer(3);

// ================= INIT =================
window.onload = () => {
  qEl.textContent = "Click START to begin EXAM MODE";
};
