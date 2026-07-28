// ======================================================
// CHEMISTRY PUZZLE GAME
// ADVANCED SCRIPT.JS
// SECTION 1A
// ======================================================


// ------------------------------------------------------
// Telegram Web App
// ------------------------------------------------------
const tg = window.Telegram?.WebApp;


if (tg) {

    tg.ready();

    tg.expand();

}



// ------------------------------------------------------
// Background Classical Music
// ------------------------------------------------------
const bgMusic = new Audio(
    "assets/music/study.mp3"
);


bgMusic.loop = true;

bgMusic.volume = 0.20;



// ------------------------------------------------------
// Sound Effects
// ------------------------------------------------------
const correctSound = new Audio(
    "assets/sounds/correct.wav"
);


const wrongSound = new Audio(
    "assets/sounds/wrong.wav"
);


const clickSound = new Audio(
    "assets/sounds/click.wav"
);



correctSound.volume = 0.8;

wrongSound.volume = 0.8;

clickSound.volume = 0.5;



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


// 40 minutes = 2400 seconds
let timer = 2400;


let timerInterval = null;



// ------------------------------------------------------
// HTML Elements
// ------------------------------------------------------
const levelSelect =
document.getElementById("levelSelect");


const gameArea =
document.getElementById("gameArea");


const question =
document.getElementById("question");


const questionNumber =
document.getElementById("questionNumber");


const progress =
document.getElementById("progress");


const timerElement =
document.getElementById("timer");


const scoreElement =
document.getElementById("score");


const resultArea =
document.getElementById("resultArea");


const startBtn =
document.getElementById("startBtn");


const backBtn =
document.getElementById("backBtn");


const musicBtn =
document.getElementById("musicBtn");



const btnA =
document.getElementById("btnA");


const btnB =
document.getElementById("btnB");


const btnC =
document.getElementById("btnC");


const btnD =
document.getElementById("btnD");



// ------------------------------------------------------
// Music Button
// ------------------------------------------------------
if(musicBtn){


    musicBtn.onclick = ()=>{


        if(bgMusic.paused){


            bgMusic.play()
            .catch(()=>{});


            musicBtn.innerHTML =
            "🎵 Music ON";


        }
        else{


            bgMusic.pause();


            musicBtn.innerHTML =
            "🔇 Music OFF";


        }


    };


}



// ------------------------------------------------------
// Select Level
// ------------------------------------------------------
function selectLevel(level){


    // Stop previous exam
    clearInterval(timerInterval);


    // Stop old music
    bgMusic.pause();

    bgMusic.currentTime = 0;



    // Reset all old data
    selectedLevel = level;


    questions = [];


    currentQuestion = 0;


    score = 0;


    lives = 3;


    answered = false;


    examStarted = false;


    timer = 2400;



    // Interface
    levelSelect.style.display =
    "none";


    gameArea.style.display =
    "block";



    resultArea.innerHTML =
    "";



    if(backBtn){

        backBtn.style.display =
        "none";

    }



    startBtn.style.display =
    "inline-block";


    startBtn.disabled = false;


    startBtn.innerHTML =
    "▶ START EXAM";



    question.innerHTML =
    "Press START EXAM";


    questionNumber.innerHTML =
    "📚 Level: " + level;


    progress.innerHTML =
    "Question 0 / 0";


    timerElement.innerHTML =
    "⏱ 40:00";



    updateScore();



    if(clickSound){

        clickSound.play()
        .catch(()=>{});

    }


}
