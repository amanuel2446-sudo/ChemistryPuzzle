let questions = [];
let current = 0;
let score = 0;
let lives = 3;
let timer = 30;
let interval;

// ========================
// START GAME
// ========================
function startGame() {
    score = 0;
    current = 0;
    lives = 3;

    document.getElementById("score").innerText =
        `⭐ Score: ${score} | ❤️ Lives: ${lives} | Level: 1`;

    loadQuestions();
}

// ========================
// LOAD QUESTIONS
// ========================
async function loadQuestions() {
    try {
        const res = await fetch("data/equilibrium.json");
        questions = await res.json();
        showQuestion();
        startTimer();
    } catch (error) {
        alert("❌ Error loading questions. Check JSON path!");
        console.log(error);
    }
}

// ========================
// SHOW QUESTION
// ========================
function showQuestion() {
    if (current >= questions.length) {
        endGame();
        return;
    }

    let q = questions[current];

    document.getElementById("question").innerText = q.question;
    document.getElementById("questionNumber").innerText =
        `Question ${current + 1} of ${questions.length}`;

    document.getElementById("btnA").innerText = q.options[0];
    document.getElementById("btnB").innerText = q.options[1];
    document.getElementById("btnC").innerText = q.options[2];
    document.getElementById("btnD").innerText = q.options[3];
}

// ========================
// ANSWER CHECK
// ========================
function checkAnswer(index) {
    let q = questions[current];

    if (index === q.answer) {
        score++;
    } else {
        lives--;
    }

    updateScore();
    nextQuestion();
}

// ========================
// NEXT QUESTION
// ========================
function nextQuestion() {
    current++;

    if (lives <= 0) {
        endGame();
        return;
    }

    if (current >= questions.length) {
        endGame();
        return;
    }

    resetTimer();
    showQuestion();
}

// ========================
// SCORE UPDATE
// ========================
function updateScore() {
    document.getElementById("score").innerText =
        `⭐ Score: ${score} | ❤️ Lives: ${lives} | Level: 1`;
}

// ========================
// TIMER
// ========================
function startTimer() {
    timer = 30;

    interval = setInterval(() => {
        timer--;

        document.getElementById("timer").innerText = `⏱ ${timer}`;

        if (timer <= 0) {
            nextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(interval);
    startTimer();
}

// ========================
// END GAME
// ========================
function endGame() {
    clearInterval(interval);

    document.getElementById("question").innerText =
        `🎉 Exam Finished! Score: ${score}/${questions.length}`;

    document.getElementById("questionNumber").innerText = "Finished";

    document.getElementById("btnA").innerText = "";
    document.getElementById("btnB").innerText = "";
    document.getElementById("btnC").innerText = "";
    document.getElementById("btnD").innerText = "";
}

// ========================
// BUTTON EVENTS
// ========================
document.getElementById("btnA").onclick = () => checkAnswer(0);
document.getElementById("btnB").onclick = () => checkAnswer(1);
document.getElementById("btnC").onclick = () => checkAnswer(2);
document.getElementById("btnD").onclick = () => checkAnswer(3);
