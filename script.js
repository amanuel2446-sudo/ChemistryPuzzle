// =============================================
// CHEMISTRY PUZZLE EXAM MODE
// PROFESSIONAL SCRIPT.JS
// PART 1A
// =============================================

// ---------- GAME VARIABLES ----------
let level = 1;
let index = 0;
let score = 0;
let lives = 3;

let questions = [];

const TOTAL_LEVELS = 3;
const EXAM_DURATION = 50 * 60;

let examTime = EXAM_DURATION;
let timerInterval = null;
let examRunning = false;

// ---------- JSON FILES ----------
const files = {
    1: "data/equilibrium.json",
    2: "data/kinetics.json",
    3: "data/electrochemistry.json"
};

// ---------- UI ----------
const qEl = document.getElementById("question");

const a = document.getElementById("btnA");
const b = document.getElementById("btnB");
const c = document.getElementById("btnC");
const d = document.getElementById("btnD");

const buttons = [a, b, c, d];

const scoreEl = document.getElementById("score");
const qNum = document.getElementById("questionNumber");
const timerEl = document.getElementById("timer");

// ---------- START EXAM ----------
function startGame() {

    clearInterval(timerInterval);

    level = 1;
    index = 0;
    score = 0;
    lives = 3;

    examTime = EXAM_DURATION;

    questions = [];

    examRunning = true;

    updateUI();

    startTimer();

    loadLevel();
}

// ---------- TIMER ----------
function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        if (!examRunning) return;

        examTime--;

        if (examTime <= 0) {

            examTime = 0;

            updateTimer();

            endExam();

            return;
        }

        updateTimer();

    }, 1000);

    updateTimer();
}

// ---------- UPDATE TIMER ----------
function updateTimer() {

    const minutes = Math.floor(examTime / 60);

    const seconds = examTime % 60;

    timerEl.textContent =
        `⏱ ${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (examTime <= 300) {

        timerEl.style.color = "#ff4444";

    } else {

        timerEl.style.color = "#00ff99";

    }

}

// ---------- UPDATE TOP PANEL ----------
function updateUI() {

    scoreEl.textContent =
        `⭐ Score: ${score}   ❤️ Lives: ${lives}   📘 Level: ${level}`;

}

// ---------- BUTTON RESET ----------
function resetButtons() {

    buttons.forEach(btn => {

        btn.disabled = false;

        btn.style.background = "#1f1f1f";

        btn.style.color = "#ffffff";

        btn.style.border = "2px solid #444";

        btn.style.transform = "scale(1)";

    });

}

// ---------- LOCK BUTTONS ----------
function lockButtons() {

    buttons.forEach(btn => {

        btn.disabled = true;

    });

}
// =============================================
// PART 1B - LOAD LEVEL + QUESTIONS SYSTEM
// =============================================

// ---------- LOAD LEVEL ----------
function loadLevel() {

    index = 0;

    resetButtons();

    qEl.textContent = "Loading questions...";

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

// ---------- SHOW QUESTION ----------
function showQuestion() {

    resetButtons();

    let q = questions[index];

    // If no question → go next level
    if (!q) {
        nextLevel();
        return;
    }

    // QUESTION TEXT
    qEl.textContent = q.question;

    // OPTIONS (NO ANSWER SHOWN HERE)
    a.textContent = q.options[0];
    b.textContent = q.options[1];
    c.textContent = q.options[2];
    d.textContent = q.options[3];

    // QUESTION COUNTER
    qNum.textContent =
        `Level ${level} | Question ${index + 1} / ${questions.length}`;

}
// =============================================
// PART 2 - ANSWER SYSTEM + GAME LOGIC
// =============================================

// ---------- CHECK ANSWER ----------
function checkAnswer(selected) {

    let q = questions[index];

    if (!q) return;

    lockButtons();

    const correct = q.answer;

    // ONLY SHOW RESULT AFTER CLICK (FIXED)
    if (selected === correct) {

        buttons[selected].style.background = "#28a745";
        buttons[selected].style.color = "#fff";

        score++;

    } else {

        buttons[selected].style.background = "#dc3545";
        buttons[selected].style.color = "#fff";

        buttons[correct].style.background = "#28a745";
        buttons[correct].style.color = "#fff";

        lives--;
    }

    updateUI();

    // NEXT QUESTION DELAY
    setTimeout(() => {

        index++;

        // GAME OVER CONDITION
        if (lives <= 0) {
            endExam();
            return;
        }

        // LEVEL COMPLETE
        if (index >= questions.length) {
            showLevelComplete();
            return;
        }

        showQuestion();

    }, 900);
}

// ---------- LEVEL COMPLETE SCREEN ----------
function showLevelComplete() {

    examRunning = false;

    document.querySelector(".card").innerHTML = `

        <div style="text-align:center;padding:30px;color:white;">

            <h1>🎉 Congratulations 🎉</h1>

            <h2>You successfully completed Level ${level}</h2>

            <p>Keep up going 🚀</p>
            <p>Next level is waiting for you</p>

            <button id="nextBtn"
                style="padding:10px 20px;font-size:18px;
                background:#00c853;color:white;border:none;
                border-radius:8px;cursor:pointer;margin-top:15px;">
                🚀 Next Level
            </button>

        </div>
    `;

    document.getElementById("nextBtn").onclick = () => {

        level++;

        if (level > TOTAL_LEVELS) {
            endExam();
            return;
        }

        loadLevel();

        examRunning = true;
    };
}

// ---------- BUTTON LOCK ----------
function lockButtons() {

    buttons.forEach(btn => btn.disabled = true);

}
// =============================================
// PART 3 - FINAL SCREEN + RESET + POLISH
// =============================================

// ---------- END EXAM ----------
function endExam() {

    examRunning = false;

    clearInterval(timerInterval);

    lockButtons();

    document.querySelector(".card").innerHTML = `

        <div style="text-align:center;padding:30px;color:white;">

            <h1>🏁 Exam Finished</h1>

            <h2>Final Result</h2>

            <p>⭐ Score: ${score}</p>
            <p>❤️ Lives Remaining: ${lives}</p>
            <p>📘 Level Reached: ${level}</p>

            <button onclick="restartExam()"
                style="padding:10px 20px;font-size:18px;
                background:#ff9800;color:white;border:none;
                border-radius:8px;cursor:pointer;margin-top:15px;">
                🔁 Restart Exam
            </button>

        </div>
    `;
}

// ---------- RESTART EXAM ----------
function restartExam() {

    level = 1;
    index = 0;
    score = 0;
    lives = 3;

    examTime = EXAM_DURATION;

    examRunning = true;

    clearInterval(timerInterval);

    startTimer();

    loadLevel();
}

// ---------- OPTIONAL MUSIC SYSTEM ----------
let audio = new Audio();

// Call this if you want background music
function playMusic(url) {

    if (!url) return;

    audio.pause();

    audio = new Audio(url);

    audio.loop = true;

    audio.volume = 0.4;

    audio.play().catch(err => console.log("Music blocked:", err));
}

// ---------- OPTIONAL CLICK SOUND ----------
function clickSound(url) {

    if (!url) return;

    let sfx = new Audio(url);

    sfx.volume = 0.6;

    sfx.play();
}

// ---------- BUTTON EVENTS (SAFE FIX) ----------
a.onclick = () => { clickSound("click.mp3"); checkAnswer(0); };
b.onclick = () => { clickSound("click.mp3"); checkAnswer(1); };
c.onclick = () => { clickSound("click.mp3"); checkAnswer(2); };
d.onclick = () => { clickSound("click.mp3"); checkAnswer(3); };

// ---------- AUTO START SAFETY ----------
window.onload = () => {

    // Optional auto start OFF by default
    console.log("Chemistry Exam Ready 🚀");

};
