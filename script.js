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
// Select Level (UPDATED)
// ------------------------------------------------------
function selectLevel(level){


    // Play click sound safely
    if(clickSound){
        clickSound.play().catch(()=>{});
    }

    // Stop any previous exam timer
    clearInterval(timerInterval);


    // Clear previous questions
    questions = [];

    // Reset all exam data
    selectedLevel = level;

    currentQuestion = 0;

    score = 0;

    lives = 3;

    answered = false;

    examStarted = false;



    // Reset timer to 50 minutes
    timer = 3000;



    // Reset interface
    levelSelect.style.display = "none";

    gameArea.style.display = "block";



    // Reset question area
    question.innerHTML =
    `
    <h2>📚 ${level}</h2>
    <p>Press START EXAM to begin</p>
    `;



    questionNumber.innerHTML =
    "Level: " + level;



    timerElement.innerHTML =
    "⏱ 50:00";



    // Reset score display
    updateScore();



    // Restore start button
    startBtn.style.display = "inline-block";

    startBtn.disabled = false;

    startBtn.innerHTML =
    "▶ START EXAM";

    startBtn.onclick = startGame;



    // Clear old answer colors
    resetButtons();



    // Hide answer buttons before exam starts
    btnA.style.display = "none";
    btnB.style.display = "none";
    btnC.style.display = "none";
    btnD.style.display = "none";


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

function restartGame(){

    // Stop old timer
    clearInterval(timerInterval);


    // Clear old questions
    questions = [];


    // Reset all game data
    selectedLevel = "";

    currentQuestion = 0;

    score = 0;

    lives = 3;

    answered = false;

    examStarted = false;


    // Reset timer
    timer = 3000;



    // Restore original game area
    gameArea.innerHTML = `

        <h2 id="question">
        Press START EXAM
        </h2>

    `;



    // Show level selection again
    gameArea.style.display = "none";

    levelSelect.style.display = "block";



    // Reset start button
    startBtn.style.display = "inline-block";

    startBtn.disabled = false;

    startBtn.innerHTML =
    "▶ START EXAM";

    startBtn.onclick = startGame;



    timerElement.innerHTML =
    "⏱ 50:00";


    updateScore();

}

// ------------------------------------------------------
// Show Question
// ------------------------------------------------------
function showQuestion(){

    if(questions.length === 0){

        question.innerHTML =
        "No questions available.";

        return;

    }


    if(currentQuestion >= questions.length){

        finishExam();

        return;

    }


    answered = false;


    resetButtons();

    enableButtons();


    let q = questions[currentQuestion];


    // Question number
    questionNumber.innerHTML =
    "Question "
    + (currentQuestion + 1)
    + " / "
    + questions.length;


    // Question text
    question.innerHTML =
    q.question;


    // Options
    btnA.innerHTML = q.options[0];
    btnB.innerHTML = q.options[1];
    btnC.innerHTML = q.options[2];
    btnD.innerHTML = q.options[3];


    updateScore();

}



// ------------------------------------------------------
// Button Events
// ------------------------------------------------------
btnA.onclick = () => checkAnswer(0);

btnB.onclick = () => checkAnswer(1);

btnC.onclick = () => checkAnswer(2);

btnD.onclick = () => checkAnswer(3);



// ------------------------------------------------------
// Check Answer
// ------------------------------------------------------
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


        // Show correct answer
        highlightCorrect(correct);


    }



    updateScore();



    setTimeout(()=>{


        currentQuestion++;



        if(lives <= 0){


            finishExam();


            return;

        }



        if(currentQuestion >= questions.length){


            finishExam();


            return;

        }



        answered = false;


        resetButtons();


        enableButtons();


        showQuestion();



    },1200);


}



// ------------------------------------------------------
// Disable Buttons
// ------------------------------------------------------
function disableButtons(){

    btnA.disabled = true;
    btnB.disabled = true;
    btnC.disabled = true;
    btnD.disabled = true;

}



// ------------------------------------------------------
// Enable Buttons
// ------------------------------------------------------
function enableButtons(){

    btnA.disabled = false;
    btnB.disabled = false;
    btnC.disabled = false;
    btnD.disabled = false;

}



// ------------------------------------------------------
// Reset Button Colors
// ------------------------------------------------------
function resetButtons(){

    const buttons = [

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


        // Remove old inline styles
        btn.style.background = "";
        btn.style.color = "";


        btn.disabled = false;


    });


}



// ------------------------------------------------------
// Highlight Correct Answer
// ------------------------------------------------------
function highlightCorrect(index){

    const buttons = [

        btnA,
        btnB,
        btnC,
        btnD

    ];


    if(buttons[index]){

        buttons[index]
        .classList.add("correct");

    }


}



// ------------------------------------------------------
// Highlight Wrong Answer
// ------------------------------------------------------
function highlightWrong(index){

    const buttons = [

        btnA,
        btnB,
        btnC,
        btnD

    ];


    if(buttons[index]){

        buttons[index]
        .classList.add("wrong");

    }


}



// ------------------------------------------------------
// Keyboard Support
// ------------------------------------------------------
document.addEventListener("keydown",(event)=>{


    if(!examStarted) return;


    if(answered) return;



    switch(event.key){


        case "1":

            checkAnswer(0);

            break;


        case "2":

            checkAnswer(1);

            break;


        case "3":

            checkAnswer(2);

            break;


        case "4":

            checkAnswer(3);

            break;


    }


});
// ======================================================
// CHEMISTRY PUZZLE
// ADVANCED SCRIPT.JS
// PART 3 (FINAL)
// ======================================================


// ------------------------------------------------------
// Finish Exam
// ------------------------------------------------------
function finishExam(){

    clearInterval(timerInterval);


    examStarted = false;


    disableButtons();


    let total = questions.length;


    let percentage = 0;


    if(total > 0){

        percentage =
        Math.round((score / total) * 100);

    }



    let grade = "";


    if(percentage >= 90){

        grade = "A+ Excellent 🏆";

    }

    else if(percentage >= 80){

        grade = "A Great Job 🎯";

    }

    else if(percentage >= 70){

        grade = "B Good Work 👍";

    }

    else if(percentage >= 60){

        grade = "C Keep Practicing 📚";

    }

    else{

        grade = "Need More Practice 💪";

    }



    saveBestScore();



    sendScoreToTelegram(
        score,
        percentage
    );



    gameArea.innerHTML = `

        <div class="result-box">

            <h2>🎉 Exam Finished</h2>


            <h3>
            📖 Level:
            ${selectedLevel}
            </h3>


            <p>
            ⭐ Score:
            ${score}/${total}
            </p>


            <p>
            📊 Percentage:
            ${percentage}%
            </p>


            <p>
            🏅 Grade:
            ${grade}
            </p>


            <button id="restartBtn">
            🔄 Restart Exam
            </button>


        </div>

    `;



    document
    .getElementById("restartBtn")
    .onclick = restartGame;


}



// ------------------------------------------------------
// Restart Game
// ------------------------------------------------------
function restartGame(){


    clearInterval(timerInterval);


    questions = [];


    currentQuestion = 0;

    score = 0;

    lives = 3;


    answered = false;

    examStarted = false;



    timer = 3000;



    gameArea.style.display = "none";


    levelSelect.style.display = "block";



    startBtn.style.display =
    "inline-block";


    startBtn.disabled = false;


    startBtn.innerHTML =
    "▶ START EXAM";



    resetButtons();



    updateScore();



    timerElement.innerHTML =
    "⏱ 50:00";



}



// ------------------------------------------------------
// Send Result To Telegram
// ------------------------------------------------------
function sendScoreToTelegram(
    score,
    percentage
){


    if(!tg) return;



    tg.sendData(JSON.stringify({

        game:
        "Chemistry Puzzle",

        level:
        selectedLevel,

        score:
        score,

        percentage:
        percentage,

        total:
        questions.length

    }));


}



// ------------------------------------------------------
// Save Best Score
// ------------------------------------------------------
function saveBestScore(){


    let best =
    Number(
    localStorage.getItem("bestScore")
    ) || 0;



    if(score > best){


        localStorage.setItem(

            "bestScore",

            score

        );


    }


}



// ------------------------------------------------------
// Get Best Score
// ------------------------------------------------------
function getBestScore(){


    return Number(

        localStorage.getItem(
        "bestScore"
        )

    ) || 0;


}



// ------------------------------------------------------
// Initial Setup
// ------------------------------------------------------
window.onload = function(){


    score = 0;

    lives = 3;

    currentQuestion = 0;

    answered = false;


    timer = 3000;



    gameArea.style.display =
    "none";


    levelSelect.style.display =
    "block";



    timerElement.innerHTML =
    "⏱ 50:00";



    updateScore();


};
