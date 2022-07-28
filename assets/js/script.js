var hide = false;
var isRunning = false;

var startButtonEl = document.querySelector("#startButton");
var questionEl = document.querySelector(".question");
var questionText = document.querySelector("#questionText");
var answerSectEl = document.querySelector("#answerSect");
var answerListEl = document.querySelector("#answerList");
var rightWrongEl = document.querySelector("#rightWrong");
var cowrongMessEl = document.querySelector('#cowrongMessage');

//var timerEl = document.querySelector(".timer");

var score = 0;
var timeLeft;

// This is a terrible implementation of random questions, but this challenge has forced my hand
var questionIndex; // Variable that corresponds to question's index in the list
var questionList = ["What is the first letter of the alphabet?",
    "What is the air speed of an unladen swallow?"];

// Each index correponds to a list of answers for that question
var answerList = [
    ["A", "B", "C", "Excuse me, what?"],
    ["I don't know?", "What kind?", "Precisely 5 km/h", "This isn't funny."]
];

console.log("Hello world. Goodbye.");

function countdown() {
    timeLeft = 60;
    document.querySelector("#timeLeft").textContent = timeLeft;

    var timeInterval = setInterval(function() {
        timeLeft--;
        //timerEl.children[0].textContent = timeLeft;
        document.querySelector("#timeLeft").textContent = timeLeft;

        if (timeLeft <= 0) {
            console.log("Alright, stop.");
            clearInterval(timeInterval);
            document.querySelector("#timeLeft").textContent = "0";
            // stop the game and show score entry
        }
    }, 1000);
}

function getRandomQuestion() {
    questionIndex = Math.floor(Math.random() * questionList.length);
    questionText.textContent = questionList[questionIndex];

    // I would randomze the order of answers, but I shouldn't make something that complex... yet.
    for (var i = 0; i < answerList[questionIndex].length; i++) {
        answerListEl.children[i].children[0].textContent = answerList[questionIndex][i];
    }
}

function checkAnswer(ans) {
    console.log("This ain't finished yet!");

    // This is so scuffed.
    switch(ans) {
        case 0:
            if (questionIndex === 0) {
                // this is correct, make a function that handles correct and wrong answers
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
        case 1:
            if (questionIndex === 1) {
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
        case 2:
            updateQuiz(false);
            break;
        case 3:
            updateQuiz(false);
            break;
    }
}

function updateQuiz(isRight) {
    rightWrongEl.setAttribute("style", "visibility: visible;");
    if (isRight) {
        score++;
        console.log("Correct!")
        cowrongMessEl.textContent = "Correct!"
    }
    else {
        // decrease time
        console.log("WROG");
        cowrongMessEl.textContent = "Wrong!"
        timeLeft -= 30;
        document.querySelector("#timeLeft").textContent = timeLeft;
    }

    //get another question
    getRandomQuestion();

    // also clear the message
    var messageClear = setTimeout(function() {
        rightWrongEl.setAttribute("style", "visibility: hidden;");
        cowrongMessEl.textContent = "";
    }, 1000);
}

document.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches("#startButton")) {
        console.log("Start the game already!!!!");
        isRunning = true;
        startButtonEl.disabled = true;

        // reset score
        score = 0;

        // Make the game elements visible when starting
        questionEl.setAttribute("style", "visibility: visible;")
        answerSectEl.setAttribute("style", "visibility: visible;")

        // Start the timer
        countdown();

        //Get the first question
        getRandomQuestion();

        return;
    }

    if (element.matches(".answer")) {
        console.log("Picked an answer, that answer being: " + element.textContent + " internally at index: " + answerList[questionIndex].indexOf(element.textContent));

        // check if selected answer is right
        checkAnswer(answerList[questionIndex].indexOf(element.textContent));
    }
});

//DEBUG

/*document.addEventListener("keydown", function() {
    if (!hide) {
        answerListEl.setAttribute("style", "visibility: hidden;");
        hide = true;
    }
    else {
        answerListEl.setAttribute("style", "visibility: visible;");
        hide = false;
    }

});*/