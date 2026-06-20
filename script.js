
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
a.onclick = () => checkAnswer(0);
b.onclick = () => checkAnswer(1);
c.onclick = () => checkAnswer(2);
d.onclick = () => checkAnswer(3);

// ================= INIT =================
window.onload = () => {
  qEl.textContent = "Click START to begin EXAM MODE";
};