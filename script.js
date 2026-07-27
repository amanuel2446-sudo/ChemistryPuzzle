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

let timer = 1800; // 40 minutes
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
// ADVANCED PART 2
// QUESTION + ANSWER SYSTEM
// =======================================


// Current selected answer lock
let answered = false;


// -------------------------------
// Display Question
// -------------------------------
function showQuestion(){

    if(currentQuestion >= questions.length){

        finishExam();
        return;
    }


    answered = false;


    let q = questions[currentQuestion];


    questionNumber.innerHTML =
    "Question " +
    (currentQuestion + 1) +
    " / " +
    questions.length;


    // ONLY SHOW QUESTION
    question.innerHTML = q.question;


    // ONLY SHOW OPTIONS
    btnA.innerHTML = q.options[0];
    btnB.innerHTML = q.options[1];
    btnC.innerHTML = q.options[2];
    btnD.innerHTML = q.options[3];


    // Remove old colors
    resetButtons();


    enableButtons();

}



// -------------------------------
// Button Click Events
// -------------------------------
btnA.onclick = () => checkAnswer(0);

btnB.onclick = () => checkAnswer(1);

btnC.onclick = () => checkAnswer(2);

btnD.onclick = () => checkAnswer(3);



// -------------------------------
// Check Answer
// -------------------------------
function checkAnswer(selected){


    // Prevent double click
    if(answered) return;


    answered = true;


    let correct =
    questions[currentQuestion].answer;


    disableButtons();



    if(selected === correct){


        score++;


        correctSound.play();


        highlightCorrect(selected);


    }
    else{


        lives--;


        wrongSound.play();


        highlightWrong(selected);


        // Show correct option AFTER wrong choice
        highlightCorrect(correct);

    }



    updateScore();



    setTimeout(()=>{


        currentQuestion++;


        if(lives <= 0){

            finishExam();

        }
        else {

    // Prepare next question
    answered = false;

    // Enable all buttons
    btnA.disabled = false;
    btnB.disabled = false;
    btnC.disabled = false;
    btnD.disabled = false;

    // Remove previous colors
    btnA.classList.remove("correct", "wrong");
    btnB.classList.remove("correct", "wrong");
    btnC.classList.remove("correct", "wrong");
    btnD.classList.remove("correct", "wrong");

    // Load next question
    showQuestion();

        }



// -------------------------------
// Disable Buttons
// -------------------------------
function disableButtons(){

    btnA.disabled = true;
    btnB.disabled = true;
    btnC.disabled = true;
    btnD.disabled = true;

}



// -------------------------------
// Enable Buttons
// -------------------------------
function enableButtons(){

    btnA.disabled = false;
    btnB.disabled = false;
    btnC.disabled = false;
    btnD.disabled = false;

}



// -------------------------------
// Reset Button Style
// -------------------------------
function resetButtons(){

    let buttons=[
        btnA,
        btnB,
        btnC,
        btnD
    ];


    buttons.forEach(btn=>{

        btn.classList.remove(
            "correct",
            "wrong"
        );

    });

}



// -------------------------------
// Highlight Correct Answer
// -------------------------------
function highlightCorrect(index){

    let buttons=[
        btnA,
        btnB,
        btnC,
        btnD
    ];


    buttons[index].classList.add("correct");

}



// -------------------------------
// Highlight Wrong Answer
// -------------------------------
function highlightWrong(index){

    let buttons=[
        btnA,
        btnB,
        btnC,
        btnD
    ];


    buttons[index].classList.add("wrong");

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
