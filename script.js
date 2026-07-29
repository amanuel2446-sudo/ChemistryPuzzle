// ======================================================
// CHEMISTRY PUZZLE GAME - PRODUCTION CODEBASE
// ADVANCED SCRIPT.JS (PART 1 OF 2)
// ======================================================

// ------------------------------------------------------
// Telegram Web App Ecosystem Optimization
// ------------------------------------------------------
const tg = window.Telegram?.WebApp;

if (tg) {
    try {
        tg.ready();
        tg.expand();
    } catch (tgError) {
        console.error("Failed to initialize Telegram WebApp SDK safely:", tgError);
    }
}

// ------------------------------------------------------
// Audio Management Layer (Background & SFX)
// ------------------------------------------------------
const bgMusic = new Audio("assets/music/study.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.20;

const correctSound = new Audio("assets/sounds/correct.wav");
const wrongSound = new Audio("assets/sounds/wrong.wav");
const clickSound = new Audio("assets/sounds/click.wav");

correctSound.volume = 0.8;
wrongSound.volume = 0.8;
clickSound.volume = 0.5;

// Helper to safely execute reactive SFX playbacks avoiding browser thread locks
const playAudioFX = async (audioInstance) => {
    if (!audioInstance) return;
    try {
        audioInstance.currentTime = 0;
        await audioInstance.play();
    } catch (audioError) {
        console.warn("Audio playback interrupted or blocked by client permissions:", audioError.message);
    }
};

// ------------------------------------------------------
// Reactive State Metrics Engine
// ------------------------------------------------------
let selectedLevel = "";
let questions = [];
let currentQuestion = 0;
let score = 0;
let lives = 3;
let answered = false;
let examStarted = false;

// Time Constants (40 minutes = 2400 seconds)
const INITIAL_TIMER_DURATION = 2400; 
let timer = INITIAL_TIMER_DURATION;
let timerInterval = null;

// ------------------------------------------------------
// DOM Elements Caching Layer
// ------------------------------------------------------
const levelSelect = document.getElementById("levelSelect");
const gameArea = document.getElementById("gameArea");
const question = document.getElementById("question");
const questionNumber = document.getElementById("questionNumber");
const progress = document.getElementById("progress");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const resultArea = document.getElementById("resultArea");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const musicBtn = document.getElementById("musicBtn");

// Answer Selection Interfaces
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const btnD = document.getElementById("btnD");

// Centralized dynamic array mapping for robust iteration and state assignment
const actionButtons = [btnA, btnB, btnC, btnD];

// ------------------------------------------------------
// Integrated Audio Controller Implementation
// ------------------------------------------------------
if (musicBtn) {
    musicBtn.onclick = async () => {
        if (bgMusic.paused) {
            await playAudioFX(bgMusic);
            musicBtn.innerHTML = "🎵 Music ON";
        } else {
            bgMusic.pause();
            musicBtn.innerHTML = "🔇 Music OFF";
        }
    };
}

// Helper utility to safely restore baseline engine variables across states
const resetCoreMetricsState = () => {
    questions = [];
    currentQuestion = 0;
    score = 0;
    lives = 3;
    answered = false;
    timer = INITIAL_TIMER_DURATION;
};

// ------------------------------------------------------
// Dynamic Level Selection Subsystem
// ------------------------------------------------------
function selectLevel(level) {
    clearInterval(timerInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;

    selectedLevel = level;
    resetCoreMetricsState();
    examStarted = false;

    if (levelSelect) levelSelect.style.display = "none";
    if (gameArea) gameArea.style.display = "block";
    if (resultArea) resultArea.innerHTML = "";
    if (backBtn) backBtn.style.display = "none";

    if (startBtn) {
        startBtn.style.display = "inline-block";
        startBtn.disabled = false;
        startBtn.innerHTML = "▶ START EXAM";
    }

    if (question) question.innerHTML = "Press START EXAM";
    if (questionNumber) questionNumber.innerHTML = `📚 Level: ${level}`;
    if (progress) progress.innerHTML = "Question 0 / 0";
    if (timerElement) timerElement.innerHTML = "⏱ 40:00";

    updateScore();
    playAudioFX(clickSound);
}

// ------------------------------------------------------
// Game Assessment Loop Orchestration
// ------------------------------------------------------
async function startGame() {
    if (examStarted) return;

    examStarted = true;

    if (startBtn) {
        startBtn.disabled = true;
        startBtn.style.display = "none";
    }

    resetCoreMetricsState();
    updateScore();

    const loaded = await loadQuestions();

    if (!loaded) {
        examStarted = false;
        if (startBtn) {
            startBtn.style.display = "inline-block";
            startBtn.disabled = false;
        }
        return;
    }

    actionButtons.forEach(btn => {
        if (btn) btn.style.display = "block";
    });

    await playAudioFX(bgMusic);
    startTimer();
    showQuestion();
}

// ------------------------------------------------------
// Asynchronous Question Bank Delivery System
// ------------------------------------------------------
async function loadQuestions() {
    const LevelDataRegistry = {
        "equilibrium": "data/equilibrium.json",
        "kinetics": "data/kinetics.json",
        "electrochemistry": "data/electrochemistry.json",
        "Oxygen containing organic compounds": "data/Oxygen containing organic compounds.json",
        "Inorganic compounds": "data/Inorganic compounds.json",
        "Atomic theory and structure": "data/Atomic theory and structure.json",
        "Chemical bonds": "data/Chemical bonds.json",
        "Hydrocarbons": "data/Hydrocarbons.json",
        "Physical state of matter": "data/Physical state of matter.json",
        "Solutions": "data/Solutions.json"
    };

    const targetFile = LevelDataRegistry[selectedLevel];

    if (!targetFile) {
        alert("Please select a level.");
        return false;
    }

    try {
        const response = await fetch(targetFile);

        if (!response.ok) {
            throw new Error(`JSON target file resource not discovered: ${targetFile}`);
        }

        questions = await response.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("Target question bank data missing or misconfigured structural layout.");
        }

        shuffleQuestions();
        return true;

    } catch (error) {
        console.error("Critical Runtime Error during async load operations:", error);
        alert("Unable to load questions.");
        return false;
    }
}

// ------------------------------------------------------
// Data Scrambling Subsystem (Fisher-Yates Pattern)
// ------------------------------------------------------
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}
// ======================================================
// CHEMISTRY PUZZLE GAME - PRODUCTION CODEBASE
// ADVANCED SCRIPT.JS (PART 2 OF 2)
// ======================================================

// ------------------------------------------------------
// Continuous Countdown & Engine Clock Synchronization
// ------------------------------------------------------
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timer--;

        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        if (timerElement) {
            timerElement.innerHTML = `⏱ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }

        if (timer <= 0) {
            clearInterval(timerInterval);
            finishExam();
        }
    }, 1000);
}

// ------------------------------------------------------
// Live HUD Metrics Dynamic Refresh
// ------------------------------------------------------
function updateScore() {
    if (scoreElement) {
        scoreElement.innerHTML = `⭐ Score: ${score} | ❤️ Lives: ${lives} | 📚 Level: ${selectedLevel}`;
    }
}

// ------------------------------------------------------
// Procedural Question Presentation Subsystem
// ------------------------------------------------------
function showQuestion() {
    if (!examStarted) return;

    if (currentQuestion >= questions.length) {
        finishExam();
        return;
    }

    answered = false;

    resetButtons();
    enableButtons();

    const currentQuestionItem = questions[currentQuestion];

    if (questionNumber) questionNumber.innerHTML = `📚 Level: ${selectedLevel}`;
    if (progress) progress.innerHTML = `Question ${currentQuestion + 1} / ${questions.length}`;
    if (question) question.innerHTML = currentQuestionItem.question;

    actionButtons.forEach((btn, index) => {
        if (btn && currentQuestionItem.options && currentQuestionItem.options[index] !== undefined) {
            btn.innerHTML = currentQuestionItem.options[index];
        }
    });
}

// ------------------------------------------------------
// Unified Selection Action Event Handlers
// ------------------------------------------------------
actionButtons.forEach((btn, clickIdx) => {
    if (btn) {
        btn.onclick = () => checkAnswer(clickIdx);
    }
});

// ------------------------------------------------------
// Response Verification & Score Mutation Engine
// ------------------------------------------------------
function checkAnswer(selected) {
    if (answered) return;

    answered = true;
    
    // Normalizes letter outputs if present or parses numerical answers (0-3) directly
    let correct = questions[currentQuestion].answer;
    if (typeof correct === "string") {
        const interpretationMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
        correct = interpretationMap[correct.trim().toUpperCase()] ?? 0;
    }
    
    disableButtons();

    if (selected === correct) {
        score++;
        playAudioFX(correctSound);
        highlightCorrect(selected);
    } else {
        lives--;
        playAudioFX(wrongSound);
        highlightWrong(selected);
        highlightCorrect(correct);
    }

    updateScore();

    setTimeout(() => {
        currentQuestion++;

        if (lives <= 0) {
            finishExam();
        } else {
            showQuestion();
        }
    }, 1200);
}

// ------------------------------------------------------
// Action Layout Interactive State Controllers
// ------------------------------------------------------
function disableButtons() {
    actionButtons.forEach(btn => {
        if (btn) btn.disabled = true;
    });
}

function enableButtons() {
    actionButtons.forEach(btn => {
        if (btn) btn.disabled = false;
    });
}

// ------------------------------------------------------
// Button Aesthetic Mutator Layer
// ------------------------------------------------------
function resetButtons() {
    actionButtons.forEach(btn => {
        if (btn) btn.classList.remove("correct", "wrong");
    });
}

function highlightCorrect(index) {
    if (actionButtons[index]) {
        actionButtons[index].classList.add("correct");
    }
}

function highlightWrong(index) {
    if (actionButtons[index]) {
        actionButtons[index].classList.add("wrong");
    }
}

// ------------------------------------------------------
// Lifecycle Assessment Termination (Clean-Up Subsystem)
// ------------------------------------------------------
function finishExam() {
    clearInterval(timerInterval);

    bgMusic.pause();
    bgMusic.currentTime = 0;

    examStarted = false;

    const total = questions.length;
    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((score / total) * 100);
    }

    let grade = "";
    if (percentage >= 90) {
        grade = "A+ 🏆";
    } else if (percentage >= 80) {
        grade = "A ⭐";
    } else if (percentage >= 70) {
        grade = "B 👍";
    } else if (percentage >= 60) {
        grade = "C";
    } else {
        grade = "Needs Practice 📚";
    }

    if (resultArea) {
        resultArea.innerHTML = `
            <h2>🎉 Exam Finished</h2>
            <p>📚 Level: ${selectedLevel}</p>
            <p>⭐ Score: ${score}/${total}</p>
            <p>📊 Percentage: ${percentage}%</p>
            <p>🏅 Grade: ${grade}</p>
        `;
    }

    if (question) question.innerHTML = "Exam Completed";
    if (progress) progress.innerHTML = "Finished";

    disableButtons();
    saveBestScore();
    sendScoreToTelegram(score, percentage);

    if (backBtn) {
        backBtn.style.display = "inline-block";
    }
}

// ------------------------------------------------------
// Back To Select Another Level
// ------------------------------------------------------
if (backBtn) {
    backBtn.onclick = function () {
        clearInterval(timerInterval);

        bgMusic.pause();
        bgMusic.currentTime = 0;

        resetCoreMetricsState();
        examStarted = false;
        selectedLevel = "";

        if (gameArea) gameArea.style.display = "none";
        if (levelSelect) levelSelect.style.display = "block";

        if (question) question.innerHTML = "Press START EXAM";
        if (questionNumber) questionNumber.innerHTML = "Select a Level to Begin";
        if (progress) progress.innerHTML = "Question 0 / 0";
        if (timerElement) timerElement.innerHTML = "⏱ 40:00";
        if (resultArea) resultArea.innerHTML = "";

        backBtn.style.display = "none";

        if (startBtn) {
            startBtn.style.display = "inline-block";
            startBtn.disabled = false;
        }

        resetButtons();
        updateScore();
    };
}

// ------------------------------------------------------
// Send Score To Telegram Bot Ecosystem
// ------------------------------------------------------
function sendScoreToTelegram(finalScore, percentage) {
    if (tg && typeof tg.sendData === "function") {
        try {
            tg.sendData(
                JSON.stringify({
                    game: "Chemistry Puzzle",
                    level: selectedLevel,
                    score: finalScore,
                    percentage: percentage
                })
            );
        } catch (tgSendError) {
            console.error("Failed to forward payload via Telegram webApp channel:", tgSendError);
        }
    }
}

// ------------------------------------------------------
// High-Score Storage Services (Local Engine)
// ------------------------------------------------------
function saveBestScore() {
    try {
        const best = localStorage.getItem("chemistryBestScore");
        if (!best || score > Number(best)) {
            localStorage.setItem("chemistryBestScore", String(score));
        }
    } catch (storageError) {
        console.warn("Storage write restricted by client privacy settings:", storageError);
    }
}

// ------------------------------------------------------
// Initialize Game On-Load Pipeline
// ------------------------------------------------------
window.onload = function () {
    updateScore();

    actionButtons.forEach(btn => {
        if (btn) btn.style.display = "none";
    });
};
