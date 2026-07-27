// ======================================================
// CHEMISTRY PUZZLE
// ADVANCED SCRIPT.JS
// PART 1
// ======================================================


// ------------------------------------------------------
// Telegram Web App
// ------------------------------------------------------
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
}


// ------------------------------------------------------
// Game Variables
// ------------------------------------------------------
let selectedLevel = "";
let questions = [];

let currentQuestion = 0;
let score = 0;
let lives = 3;

let answered = false;
let examStarted = false;

let timer = 3000; // 50 Minutes
let timerInterval = null;


// ------------------------------------------------------
// HTML Elements
// ------------------------------------------------------
const levelSelect = document.getElementById("levelSelect");
const gameArea = document.getElementById("gameArea");

const question = document.getElementById("question");
const questionNumber = document.getElementById("questionNumber");

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const btnD = document.getElementById("btnD");

const startBtn = document.getElementById("startBtn");


// ------------------------------------------------------
// Sounds
// ------------------------------------------------------
const correctSound = new Audio("assets/sounds/correct.wav");
const wrongSound = new Audio("assets/sounds/wrong.wav");
const clickSound = new Audio("assets/sounds/click.wav");

correctSound.volume = 0.8;
wrongSound.volume = 0.8;
clickSound.volume = 0.5;


// ------------------------------------------------------
// Select Level
// ------------------------------------------------------
function selectLevel(level){

    clickSound.play();

    selectedLevel = level;

    levelSelect.style.display = "none";
    gameArea.style.display = "block";

    question.innerHTML =
        "Press <b>START EXAM</b>";

    questionNumber.innerHTML =
        "Level: " + level;

    score = 0;
    lives = 3;
    currentQuestion = 0;
    answered = false;

    timer = 3000;

    updateScore();

    timerElement.innerHTML = "⏱ 50:00";

    startBtn.style.display = "inline-block";
}


// ------------------------------------------------------
// Start Exam
// ------------------------------------------------------
async function startGame(){

    if(examStarted) return;

    examStarted = true;

    startBtn.disabled = true;
    startBtn.style.display = "none";

    score = 0;
    lives = 3;
    currentQuestion = 0;
    answered = false;

    timer = 3000;

    updateScore();

    const success = await loadQuestions();

    if(!success){

        examStarted = false;

        startBtn.disabled = false;
        startBtn.style.display = "inline-block";

        return;

    }

    startTimer();

    showQuestion();

}


// ------------------------------------------------------
// Load Questions
// ------------------------------------------------------
async function loadQuestions(){

    let file = "";

    switch(selectedLevel){

        case "equilibrium":
            file = "data/equilibrium.json";
            break;

        case "kinetics":
            file = "data/kinetics.json";
            break;

        case "electrochemistry":
            file = "data/electrochemistry.json";
            break;

        case "Oxygen containing organic compounds":
            file = "data/Oxygen containing organic compounds.json";
            break;

        case "Inorganic compounds":
            file = "data/Inorganic compounds.json";
            break;

        case "Atomic theory and structure":
            file = "data/Atomic theory and structure.json";
            break;

        case "Chemical bonds":
            file = "data/Chemical bonds.json";
            break;

        case "Hydrocarbons":
            file = "data/Hydrocarbons.json";
            break;

        case "Physical state of matter":
            file = "data/Physical state of matter.json";
            break;

        case "Solutions":
            file = "data/Solutions.json";
            break;

        default:
            alert("Select a level.");
            return false;

    }

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error("Cannot load JSON.");

        }

        questions = await response.json();

        if(!Array.isArray(questions) || questions.length === 0){

            throw new Error("Question list is empty.");

        }

        shuffleQuestions();

        return true;

    }

    catch(error){

        console.error(error);

        alert("Unable to load questions.");

        return false;

    }

}


// ------------------------------------------------------
// Shuffle Questions
// ------------------------------------------------------
function shuffleQuestions(){

    for(let i = questions.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [questions[i], questions[j]] =
        [questions[j], questions[i]];

    }

}


// ------------------------------------------------------
// Timer
// ------------------------------------------------------
function startTimer(){

    clearInterval(timerInterval);

    timerElement.innerHTML = "⏱ 50:00";

    timerInterval = setInterval(()=>{

        timer--;

        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        timerElement.innerHTML =
            "⏱ "
            + String(minutes).padStart(2,"0")
            + ":"
            + String(seconds).padStart(2,"0");

        if(timer <= 0){

            clearInterval(timerInterval);

            finishExam();

        }

    },1000);

}


// ------------------------------------------------------
// Update Score
// ------------------------------------------------------
function updateScore(){

    scoreElement.innerHTML =
        "⭐ " + score +
        " | ❤️ " + lives +
        " | 📖 " + selectedLevel +
        " | ❓ " + (currentQuestion + 1);

}


// ------------------------------------------------------
// Reset Game
// ------------------------------------------------------
function resetGame(){

    score = 0;
    lives = 3;
    currentQuestion = 0;
    answered = false;

    timer = 3000;

    clearInterval(timerInterval);

                               }

