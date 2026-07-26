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
// =======================================
// CHEMISTRY PUZZLE GAME
// PART 2
// =======================================


// -------------------------------
// Display Question
// -------------------------------
function showQuestion(){

    if(currentQuestion >= questions.length){

        finishExam();
        return;
    }


    let q = questions[currentQuestion];


    questionNumber.innerHTML =
    "Question "
    +(currentQuestion + 1)
    +" / "
    +questions.length;


    question.innerHTML = q.question;


    btnA.innerHTML = q.options[0];
    btnB.innerHTML = q.options[1];
    btnC.innerHTML = q.options[2];
    btnD.innerHTML = q.options[3];


    enableButtons();

}


// -------------------------------
// Answer Buttons
// -------------------------------

btnA.onclick = function(){

    checkAnswer(0);

};


btnB.onclick = function(){

    checkAnswer(1);

};


btnC.onclick = function(){

    checkAnswer(2);

};


btnD.onclick = function(){

    checkAnswer(3);

};



// -------------------------------
// Check Answer
// -------------------------------
function checkAnswer(selected){


    disableButtons();


    let correct =
    questions[currentQuestion].answer;


    if(selected === correct){


        score += 1;


        correctSound.play();


    }
    else{


        lives--;


        wrongSound.play();


    }


    updateScore();



    setTimeout(()=>{


        if(lives <= 0){

            finishExam();

            return;

        }


        currentQuestion++;

        showQuestion();



    },1000);


}



// -------------------------------
// Disable Buttons
// -------------------------------
function disableButtons(){

    btnA.disabled=true;
    btnB.disabled=true;
    btnC.disabled=true;
    btnD.disabled=true;

}



// -------------------------------
// Enable Buttons
// -------------------------------
function enableButtons(){

    btnA.disabled=false;
    btnB.disabled=false;
    btnC.disabled=false;
    btnD.disabled=false;

}



// -------------------------------
// Prevent Reload During Exam
// -------------------------------
window.onbeforeunload=function(){

    if(examStarted){

        return "Exam is running.";

    }

};
// =======================================
// CHEMISTRY PUZZLE GAME
// PART 3
// =======================================


// -------------------------------
// Finish Exam
// -------------------------------
function finishExam(){

    clearInterval(timerInterval);

    examStarted = false;


    let total = questions.length;

    let percentage = 0;


    if(total > 0){

        percentage =
        Math.round((score / total) * 100);

    }



    let badge = getBadge(percentage);



    questionNumber.innerHTML =
    "🏁 Exam Completed";


    question.innerHTML = `

        <div class="result">

        <h2>🎉 Your Result</h2>

        <p>⭐ Score: ${score}/${total}</p>

        <p>📊 Percentage: ${percentage}%</p>

        <p>🏅 Achievement: ${badge}</p>

        </div>

    `;



    btnA.style.display="none";
    btnB.style.display="none";
    btnC.style.display="none";
    btnD.style.display="none";


    startBtn.style.display="block";

    startBtn.innerHTML=
    "🔄 Restart Exam";


    startBtn.onclick = restartGame;



    sendScoreToTelegram(score, percentage);

}



// -------------------------------
// Badge System
// -------------------------------
function getBadge(percent){


    if(percent >= 90){

        return "🥇 Chemistry Master";

    }


    else if(percent >= 75){

        return "🥈 Chemistry Expert";

    }


    else if(percent >= 50){

        return "🥉 Chemistry Learner";

    }


    else{

        return "📚 Keep Practicing";

    }


}



// -------------------------------
// Restart Game
// -------------------------------
function restartGame(){


    selectedLevel="";


    questions=[];


    currentQuestion=0;

    score=0;

    lives=3;


    timer=1800;


    btnA.style.display="block";
    btnB.style.display="block";
    btnC.style.display="block";
    btnD.style.display="block";


    startBtn.innerHTML=
    "▶ START EXAM";


    startBtn.onclick=startGame;


    gameArea.style.display="none";

    levelSelect.style.display="block";


    updateScore();

}



// -------------------------------
// Send Result to Telegram
// -------------------------------
function sendScoreToTelegram(score, percentage){


    if(tg){


        tg.sendData(JSON.stringify({

            game:"Chemistry Puzzle",

            level:selectedLevel,

            score:score,

            percentage:percentage

        }));


    }

}



// -------------------------------
// Save Best Score Locally
// -------------------------------
function saveBestScore(){


    let best =
    localStorage.getItem("bestScore");


    if(!best || score > best){


        localStorage.setItem(
            "bestScore",
            score
        );


    }


}



// -------------------------------
// Initialize Game
// -------------------------------
window.onload=function(){

    updateScore();

};
