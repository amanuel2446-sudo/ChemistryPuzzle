let level = 1;
let index = 0;
let score = 0;
let lives = 3;
let timer = 30;
let interval;
let questions = [];

// FILE MAP (3 LEVELS)
const files = {
  1: "data/equilibrium.json",
  2: "data/kinetics.json",
  3: "data/electrochemistry.json"
};

// ================= UI =================
const qEl = document.getElementById("question");
const a = document.getElementById("btnA");
const b = document.getElementById("btnB");
const c = document.getElementById("btnC");
const d = document.getElementById("btnD");
const scoreEl = document.getElementById("score");
const qNum = document.getElementById("questionNumber");
const timerEl = document.getElementById("timer");

// ================= START GAME =================
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

      if (!questions || questions.length === 0) {
        qEl.textContent = "❌ No questions found!";
        return;
      }

      showQuestion();
      updateUI();
      startTimer();
    })
    .catch(err => {
      console.log(err);
      qEl.textContent = "❌ Error loading questions";
    });
}

// ================= SHOW QUESTION =================
function showQuestion() {
  let q = questions[index];

  if (!q) {
    nextLevel();
    return;
  }

  qEl.textContent = q.question;

  a.textContent = q.options[0];
  b.textContent = q.options[1];
  c.textContent = q.options[2];
  d.textContent = q.options[3];

  qNum.textContent = `Level ${level} | Q${index + 1}/${questions.length}`;
}

// ================= CHECK ANSWER =================
function checkAnswer(i) {
  let q = questions[index];

  if (!q) return;

  if (i === q.answer) {
    score++;
  } else {
    lives--;
  }

  updateUI();
  nextQuestion();
}

// ================= NEXT QUESTION =================
function nextQuestion() {
  index++;

  if (lives <= 0) {
    endGame();
    return;
  }

  if (index >= questions.length) {
    nextLevel();
    return;
  }

  resetTimer();
  showQuestion();
}

// ================= NEXT LEVEL =================
function nextLevel() {
  level++;

  if (level > 3) {
    endGame();
    return;
  }

  loadLevel();
}

// ================= UI UPDATE =================
function updateUI() {
  scoreEl.textContent =
    `⭐ Score: ${score} | ❤️ Lives: ${lives} | Level: ${level}`;
}

// ================= TIMER =================
function startTimer() {
  timer = 30;

  interval = setInterval(() => {
    timer--;

    timerEl.textContent = `⏱ ${timer}`;

    if (timer <= 0) {
      lives--;
      updateUI();
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  startTimer();
}

// ================= END GAME =================
function endGame() {
  clearInterval(interval);

  qEl.textContent = `🎉 Exam Finished! Final Score: ${score}`;
  qNum.textContent = "Finished";

  a.textContent = "";
  b.textContent = "";
  c.textContent = "";
  d.textContent = "";

  timerEl.textContent = "";
}

// ================= BUTTON EVENTS =================
a.onclick = () => checkAnswer(0);
b.onclick = () => checkAnswer(1);
c.onclick = () => checkAnswer(2);
d.onclick = () => checkAnswer(3);
