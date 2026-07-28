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
// ======================================================
// CHEMISTRY PUZZLE GAME
// ADVANCED SCRIPT.JS
// SECTION 1B
// ======================================================


// ------------------------------------------------------
// Start Exam
// ------------------------------------------------------
async function startGame(){


    if(examStarted) return;



    examStarted = true;


    startBtn.disabled = true;


    startBtn.style.display =
    "none";



    // Reset current exam
    currentQuestion = 0;

    score = 0;

    lives = 3;

    answered = false;

    timer = 2400;



    updateScore();



    const loaded =
    await loadQuestions();



    if(!loaded){


        examStarted = false;


        startBtn.style.display =
        "inline-block";


        startBtn.disabled = false;


        return;


    }



    // Show answer buttons
    btnA.style.display = "block";
    btnB.style.display = "block";
    btnC.style.display = "block";
    btnD.style.display = "block";



    // Start music
    bgMusic.play()
    .catch(()=>{});



    startTimer();



    showQuestion();



}



// ------------------------------------------------------
// Load Questions From JSON
// ------------------------------------------------------
async function loadQuestions(){


    let file = "";



    switch(selectedLevel){


        case "equilibrium":

            file =
            "data/equilibrium.json";

            break;



        case "kinetics":

            file =
            "data/kinetics.json";

            break;



        case "electrochemistry":

            file =
            "data/electrochemistry.json";

            break;



        case "Oxygen containing organic compounds":

            file =
            "data/Oxygen containing organic compounds.json";

            break;



        case "Inorganic compounds":

            file =
            "data/Inorganic compounds.json";

            break;



        case "Atomic theory and structure":

            file =
            "data/Atomic theory and structure.json";

            break;



        case "Chemical bonds":

            file =
            "data/Chemical bonds.json";

            break;



        case "Hydrocarbons":

            file =
            "data/Hydrocarbons.json";

            break;



        case "Physical state of matter":

            file =
            "data/Physical state of matter.json";

            break;



        case "Solutions":

            file =
            "data/Solutions.json";

            break;



        default:


            alert(
            "Please select a level."
            );


            return false;

    }



    try{


        const response =
        await fetch(file);



        if(!response.ok){


            throw new Error(
            "JSON file not found: " + file
            );


        }



        questions =
        await response.json();



        if(
            !Array.isArray(questions)
            ||
            questions.length === 0
        ){


            throw new Error(
            "No questions available."
            );


        }



        shuffleQuestions();



        return true;



    }


    catch(error){


        console.error(error);


        alert(
        "Unable to load questions."
        );


        return false;


    }



}



// ------------------------------------------------------
// Shuffle Questions
// ------------------------------------------------------
function shuffleQuestions(){


    for(
        let i = questions.length - 1;
        i > 0;
        i--
    ){


        let j =
        Math.floor(
        Math.random() * (i + 1)
        );



        [
            questions[i],
            questions[j]
        ]
        =
        [
            questions[j],
            questions[i]
        ];


    }


}



// ------------------------------------------------------
// 40 Minute Timer
// ------------------------------------------------------
function startTimer(){


    clearInterval(timerInterval);



    timerInterval =
    setInterval(()=>{


        timer--;



        let minutes =
        Math.floor(timer / 60);



        let seconds =
        timer % 60;



        timerElement.innerHTML =

        "⏱ " +

        String(minutes)
        .padStart(2,"0")

        +

        ":"

        +

        String(seconds)
        .padStart(2,"0");



        if(timer <= 0){


            clearInterval(timerInterval);


            finishExam();


        }



    },1000);



}



// ------------------------------------------------------
// Update Score Display
// ------------------------------------------------------
function updateScore(){


    scoreElement.innerHTML =


    "⭐ Score: "
    + score

    +

    " | ❤️ Lives: "
    + lives

    +

    " | 📚 Level: "
    + selectedLevel;



}