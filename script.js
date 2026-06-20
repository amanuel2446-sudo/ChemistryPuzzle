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
function startGame() let level = 1;
let index = 0;
let score = 0;
let lives = 3;
let questions = [];

const files = {
  1: "data/equilibrium.json",
  2: "data/kinetics.json",
  3: "data/electrochemistry.json"
};

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

      if (!questions || questions.length === 0) {
        qEl.textContent = "No questions found!";
        return;
      }

      showQuestion();
      updateScore();
    })
    .catch(err => {
      console.log(err);
      qEl.textContent = "❌ Error loading file";
    });
}
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

  qNum.textContent = `Level ${level} | Question ${index + 1}`;
      }
}

// ================= TIMER =================
function startTimer() {

  timeLeft = 30;

  clearInterval(timer);

  timer = setInterval(() => {

    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timer);

      if (!answered) {
        wrongAnswer();
      }
    }

  }, 1000);
}

// ================= ANSWER =================
function checkAnswer(i) {

  if (answered) return; // ❌ BLOCK MULTIPLE CLICK

  answered = true;
  clearInterval(timer);

  let correct = questions[index].answer;

  if (i === correct) {
    score += 10;
  } else {
    wrongAnswer();
    return;
  }

  disableButtons();

  setTimeout(() => {
    index++;
    showQuestion();
  }, 800);
}

// ================= WRONG =================
function wrongAnswer() {

  lives--;

  if (lives <= 0) {
    gameOver();
    return;
  }

  disableButtons();

  setTimeout(() => {
    index++;
    showQuestion();
  }, 800);
}

// ================= DISABLE BUTTONS =================
function disableButtons() {
  a.disabled = true;
  b.disabled = true;
  c.disabled = true;
  d.disabled = true;
}

// ================= LEVEL COMPLETE =================
function levelComplete() {

  clearInterval(timer);

  alert(`Level ${level} completed! Score: ${score}`);

  if (level < 3) {
    level++;
    loadLevel();
  } else {
    showFinalResult();
  }
}

// ================= FINAL RESULT =================
function showFinalResult() {

  qEl.textContent = "🏆 EXAM COMPLETED";

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
.onclick = () => checkAnswer(0);
b.onclick = () => checkAnswer(1);
c.onclick = () => checkAnswer(2);
d.onclick = () => checkAnswer(3);

// ================= INIT =================
window.onload = () => {
  qEl.textContent = "Click START to begin EXAM MODE";
};
    

 
