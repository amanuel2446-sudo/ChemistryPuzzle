// =======================================
// CHEMISTRY PUZZLE GAME
// PART 1
// =======================================

// -------------------------------
// Telegram Web App
// -------------------------------
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

// -------------------------------
// Game Variables
// -------------------------------
let selectedLevel = "";
let questions = [];

let currentQuestion = 0;
let score = 0;
let lives = 3;

let timer = 1800; // 30 minutes
let timerInterval = null;

let examStarted = false;

// -------------------------------
// HTML Elements
// -------------------------------
const levelSelect = document.getElementById("levelSelect");
const gameArea = document.getElementById("gameArea");

const question = document.getElementById("question");
const questionNumber = document.getElementById("questionNumber");

const timerElement = document.getElementById("timer");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const btnD = document.getElementById("btnD");

const scoreElement = document.getElementById("score");

const startBtn = document.getElementById("startBtn");

// -------------------------------
// Sounds
// -------------------------------
const correctSound = new Audio("assets/sounds/correct.wav");
const wrongSound = new Audio("assets/sounds/wrong.wav");
const clickSound = new Audio("assets/sounds/click.wav");

// -------------------------------
// Select Level
// -------------------------------
function selectLevel(level){

    clickSound.play();

    selectedLevel = level;

    levelSelect.style.display = "none";

    gameArea.style.display = "block";

    question.innerHTML =
        "Press START EXAM";

    questionNumber.innerHTML =
        "Selected: " + level.toUpperCase();

}

// -------------------------------
// Start Game
// -------------------------------
async function startGame(){

    if(examStarted) return;

    examStarted = true;

    startBtn.style.display = "none";

    score = 0;
    lives = 3;
    currentQuestion = 0;

    timer = 1800;

    updateScore();

    startTimer();

    await loadQuestions();

    showQuestion();

}

// -------------------------------
// Load JSON Questions
// -------------------------------
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

        default:
            alert("Please select a level.");
            return;
    }

    try{

        const response = await fetch(file);

        questions = await response.json();

        shuffleQuestions();

    }

    catch(error){

        console.error(error);

        alert("Unable to load questions.");

    }

}

// -------------------------------
// Shuffle Questions
// -------------------------------
function shuffleQuestions(){

    for(let i=questions.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [questions[i],questions[j]] =
        [questions[j],questions[i]];

    }

}

// -------------------------------
// Timer
// -------------------------------
function startTimer(){

    clearInterval(timerInterval);

    timerInterval = setInterval(()=>{

        timer--;

        let minutes=Math.floor(timer/60);

        let seconds=timer%60;

        timerElement.innerHTML =
        "⏱ "
        +String(minutes).padStart(2,"0")
        +":"
        +String(seconds).padStart(2,"0");

        if(timer<=0){

            clearInterval(timerInterval);

            finishExam();

        }

    },1000);

}

// -------------------------------
// Update Score
// -------------------------------
function updateScore(){

    scoreElement.innerHTML=

    "⭐ Score: "
    +score+

    " | ❤️ Lives: "
    +lives+

    " | 📚 Level: "
    +selectedLevel;

}

// -------------------------------
// Placeholder
// (Part 2 will complete this)
// -------------------------------
function showQuestion(){

    if(questions.length===0){

        question.innerHTML="Loading...";

        return;

    }

}
