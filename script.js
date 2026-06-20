let level = 1;
let index = 0;
let score = 0;
let lives = 3;

let questions = [];

let examTime = 50 * 60;
let timerInterval;

// FILES
const files = {
  1: "data/equilibrium.json",
  2: "data/kinetics.json",
  3: "data/electrochemistry.json"
};

// UI ELEMENTS
const qEl = document.getElementById("question");
const a = document.getElementById("btnA");
const b = document.getElementById("btnB");
const c = document.getElementById("btnC");
const d = document.getElementById("btnD");
const scoreEl = document.getElementById("score");
const qNum = document.getElementById("questionNumber");
const timerEl = document.getElementById("timer");

const buttons = [a, b, c, d];

// ================= START EXAM =================
function startGame() {
  level = 1;
  index = 0;
  score = 0;
  lives = 3;

  startTimer();
  loadLevel();
}

// ================= LOAD LEVEL =================
function loadLevel() {
  index = 0;

  fetch(files[level])
    .then(res => res.json())
    .then(data => {
      questions = data;

      if (!Array.isArray(questions)) {
        qEl.textContent = "❌ Invalid JSON format";
        return;
      }

      showQuestion();
      updateUI();
    })
    .catch(err => {
      console.log(err);
      qEl.textContent = "❌ Error loading questions";
    });
}

// ================= SHOW QUESTION (SAFE - NO ANSWER DISPLAY) =================
function showQuestion() {
  let q = questions[index];

  if (!q) {
    nextLevel();
    return;
  }

  resetButtons(); // IMPORTANT: clears previous colors FIRST

  // SHOW ONLY QUESTION + OPTIONS
  qEl.textContent = q.question;

  a.textContent = q.options[0];
  b.textContent = q.options[1];
  c.textContent = q.options[2];
  d.textContent = q.options[3];

  qNum.textContent =
    `Level ${level} | Question ${index + 1} / ${questions.length}`;
}

// ================= ANSWER CHECK (ONLY HERE SHOW ANSWER) =================
function checkAnswer(selected) {
  let q = questions[index];
  if (!q) return;

  lockButtons();

  const correct = q.answer;

  // SHOW CORRECT ONLY AFTER CLICK
  if (selected === correct) {
    buttons[selected].style.background = "#28a745";
    score++;
  } else {
    buttons[selected].style.background = "#dc3545";
    buttons[correct].style.background = "#28a745";
    lives--;
  }

  updateUI();

  setTimeout(() => {
    index++;

    if (lives <= 0) {
      endExam();
      return;
    }

    if (index >= questions.length) {
      nextLevel();
      return;
    }

    showQuestion();
  }, 800);
}

// ================= BUTTON CONTROL =================
function lockButtons() {
  buttons.forEach(btn => btn.disabled = true);
}

function resetButtons() {
  buttons.forEach(btn => {
    btn.disabled = false;
    btn.style.background = "#1e1e1e";
    btn.style.color = "white";
  });
}

// ================= LEVEL SYSTEM =================
function nextLevel() {
  level++;

  if (level > 3) {
    endExam();
    return;
  }

  loadLevel();
}

// ================= UI UPDATE =================
function updateUI() {
  scoreEl.textContent =
    `⭐ Score: ${score} | ❤️ Lives: ${lives} | 📘 Level: ${level}`;
}

// ================= 50 MIN TIMER =================
function startTimer() {
  timerInterval = setInterval(() => {
    examTime--;

    let min = Math.floor(examTime / 60);
    let sec = examTime % 60;

    timerEl.textContent =
      `⏱ ${min}:${sec < 10 ? "0" + sec : sec}`;

    if (examTime <= 0) {
      endExam();
    }
  }, 1000);
}

// ================= END EXAM =================
function endExam() {
  clearInterval(timerInterval);

  qEl.textContent = `🎉 Exam Finished! Final Score: ${score}`;
  qNum.textContent = "EXAM COMPLETED";

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.textContent = "";
  });

  timerEl.textContent = "⛔ TIME UP";
}

// ================= EVENT LISTENERS =================
a.onclick = () => checkAnswer(0);
b.onclick = () => checkAnswer(1);
c.onclick = () => checkAnswer(2);
d.onclick = () => checkAnswer(3);
