var hide = false;
var isRunning = false;

var startButtonEl = document.querySelector("#startButton");
var questionEl = document.querySelector(".question");
var questionText = document.querySelector("#questionText");
var answerSectEl = document.querySelector("#answerSect");
var answerListEl = document.querySelector("#answerList");
var rightWrongEl = document.querySelector("#rightWrong");
var cowrongMessEl = document.querySelector('#cowrongMessage');
var highScoreEl = document.querySelector("#highScore");

//var timerEl = document.querySelector(".timer");

var score = 0;
var timeLeft;
var highScores = [];
var timeInterval;

// This is a terrible implementation of a questions list, but this challenge has forced my hand
var questionIndex; // Variable that corresponds to question's index in the list
var questionList = [
    "Which is a valid comparison operator used in Javascript?",
    "What is used to hold true or false values?",
    "What are the containers used to hold values in Javascript called?",
    "Commonly used data types do not include:",
    "The condition in an if/else statement is enclosed with: ",
    "Arrays in Javascript can be used to store: ",
    "A very useful tool used during development and debugging and printing content to the debugger is:",
    "What do you use to hold data that persists after the page is exited?",
    "How do you create an HTML element in Javascript?",
    "What do you use to select elements in Javascript?"
];

// Each index correponds to a list of answers for that question
var answerList = [
    ["===", "%", "/", "+"],
    ["Strings", "Booleans", "Numbers", "Arrays"],
    ["Numbers", "Boxes", "Variables", "Cells"],
    ["Strings", "Booleans", "Alerts", "Numbers"],
    ["Quotes", "Curly braces", "Parentheses", "Square brackets"],
    ["Numbers and strings", "Other arrays", "Booleans", "All of the above"],
    ["Javascript", "Terminal/bash", "For loops", "Console.log"],
    ["Local storage", "Arrays", "Session storage", "Objects"],
    ["makeElement", "createElement", "newElement", "addElement"],
    ["getElementById", "getElementsByClassName", "querySelector", "All of the above"]
];

function countdown() {
    timeLeft = 60;
    document.querySelector("#timeLeft").textContent = timeLeft;

    timeInterval = setInterval(function() {
        timeLeft--;
        //timerEl.children[0].textContent = timeLeft;
        document.querySelector("#timeLeft").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timeInterval);
            document.querySelector("#timeLeft").textContent = "0";

            // stop the game and show score entry
            showScoreEntry();
        }
    }, 1000);
}

function showScoreEntry() {
    isRunning = false;

    questionEl.setAttribute("style", "display: none;");
    answerSectEl.setAttribute("style", "display: none;");

    highScoreEl.textContent = "Game over, your final score was: " + score;
    highScoreEl.setAttribute("style", "display: block;");

    var nameEntryEl = document.createElement("INPUT");
    nameEntryEl.setAttribute("id", "nameEntry");
    nameEntryEl.setAttribute("type", "text");
    nameEntryEl.setAttribute("maxLength", "3");
    highScoreEl.appendChild(nameEntryEl);

    var submitScoreEl = document.createElement("button");
    submitScoreEl.textContent = "Submit Score";
    submitScoreEl.setAttribute("id", "submitScore")
    highScoreEl.appendChild(submitScoreEl);
}

function getNextQuestion() {
    if (questionIndex === 9) {
        clearInterval(timeInterval);
        document.querySelector("#timeLeft").textContent = "0";

        showScoreEntry();
        return;
    }

    questionIndex++;
    questionText.textContent = questionList[questionIndex];

    for (var i = 0; i < answerList[questionIndex].length; i++) {
        answerListEl.children[i].children[0].textContent = answerList[questionIndex][i];
    }
}

function checkAnswer(ans) {

    // Whenever a new question is added, change this switch case to account for it. This is incredibly scuffed, but I don't have time to think of a better implementation
    switch(ans) {
        case 0:
            if (questionIndex === 0 || questionIndex === 7) {
                // this is correct, make a function that handles correct and wrong answers
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
        case 1:
            if (questionIndex === 1 || questionIndex === 8) {
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
        case 2:
            if (questionIndex === 2 || questionIndex === 3 || questionIndex === 4) {
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
        case 3:
            if (questionIndex === 5 || questionIndex === 6 || questionIndex === 9) {
                updateQuiz(true);
                break;
            }
            updateQuiz(false);
            break;
    }
}

function updateQuiz(isRight) {
    rightWrongEl.setAttribute("style", "visibility: visible;");
    if (isRight) {
        score++;
        cowrongMessEl.textContent = "Correct!"
    }
    else {
        // decrease time
        cowrongMessEl.textContent = "Wrong!"
        timeLeft -= 30;
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        document.querySelector("#timeLeft").textContent = timeLeft;
    }

    //get next question
    getNextQuestion();

    // also clear the message
    setTimeout(function() {
        rightWrongEl.setAttribute("style", "visibility: hidden;");
        cowrongMessEl.textContent = "";
    }, 1000);
}

function showHighScores() {
    highScoreEl.innerHTML = "";

    if (highScoreEl.style.display === "" || highScoreEl.style.display === "none") {
        highScoreEl.setAttribute("style", "display: block");
    }

    //clear high scores or any other elements and make a list of the high scores in local storage
    if (highScores.length > 0) {
        scoreListEl = document.createElement("ol");

        for (var i = 0; i < highScores.length; i++) {
            var listEl = document.createElement("li");
            listEl.textContent = highScores[i].name + " - " + highScores[i].hiScore;

            scoreListEl.appendChild(listEl);
        }

        highScoreEl.appendChild(scoreListEl);
    }
    else {
        var newP = document.createElement("p");
        newP.textContent = "No high scores available.";
        highScoreEl.appendChild(newP);
    }

    // add button to hide high score table and re-enable the start button
    var backButtonEl = document.createElement("button");
    backButtonEl.textContent = "Back"
    backButtonEl.setAttribute("id", "backButton");

    // add button that also clears high scores
    var clearButtonEl = document.createElement("button");
    clearButtonEl.textContent = "Clear scores"
    clearButtonEl.setAttribute("id", "clearButton");

    highScoreEl.appendChild(backButtonEl);
    highScoreEl.appendChild(clearButtonEl);
}

function init() {
    // get high scores
    
    if (localStorage.getItem("scores") === null) {
        localStorage.setItem("scores", highScores);
    }
    else {
        console.log("There's some scores.");
        if (localStorage.getItem("scores") === '') {
            // This prevents a syntax error from being raised, due to JSON.parse not liking empty strings
            return;
        }
        else {
            highScores = JSON.parse(localStorage.getItem("scores"));
        }
    }
}

document.addEventListener("click", function(event) {
    var element = event.target;

    if (element.matches("#startButton")) {
        console.log("Start the game already!!!!");
        isRunning = true;
        startButtonEl.disabled = true;
        startButtonEl.setAttribute("style", "visibility: hidden;");

        // reset score and starting question
        score = 0;
        questionIndex = -1;

        // Make the game elements visible when starting
        questionEl.setAttribute("style", "visibility: visible;")
        answerSectEl.setAttribute("style", "visibility: visible;")

        // Start the timer
        countdown();

        //Get the first question
        getNextQuestion();

        return;
    }

    if (element.matches("#viewScores")) {
        if (isRunning) {
            alert("You can't view scores while the game is running!");
            return;
        }
        //stop game if it's done in the middle of one
        //clearInterval(timeInterval);


        startButtonEl.setAttribute("style", "visibility: hidden;");
        startButtonEl.disabled = true;

        showHighScores();
        return;
    }

    if (element.matches(".answer")) {

        // check if selected answer is right
        checkAnswer(answerList[questionIndex].indexOf(element.textContent));
        return;
    }

    if (element.matches("#submitScore")) {
        let newName = document.getElementById("nameEntry").value;

        let newScore = {name: newName, hiScore: score};
        console.log(newScore);
        console.log(JSON.stringify(newScore));

        // insert score and sort
        highScores.push(newScore);

        highScores.sort((a,b) => {
            return b.hiScore - a.hiScore;
        })

        localStorage.setItem("scores", JSON.stringify(highScores));

        //after saving score, reveal high score table
        showHighScores();

        return;
    }

    if (element.matches("#clearButton")) {
        highScores.splice(0, highScores.length);
        localStorage.removeItem("scores");

        showHighScores();
        return;
    }

    if (element.matches("#backButton")) {
        //clear the high score table
        highScoreEl.innerHTML = "";
        highScoreEl.setAttribute("style", "display: none;");
        startButtonEl.setAttribute("style", "visibility: visible;");
        startButtonEl.disabled = false;

        return;
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

init();