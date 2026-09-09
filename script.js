// DOM ELEMENTS

const startScreen = document.getElementById("start-screen");

const quizScreen = document.getElementById("quiz-screen");

const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");

const questionText = document.getElementById("question-text");

const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan =
    document.getElementById("current-question");

const totalQuestionsSpan =
    document.getElementById("total-questions");

const scoreSpan =
    document.getElementById("score");

const finalScoreSpan =
    document.getElementById("final-score");

const maxScoreSpan =
    document.getElementById("max-score");

const resultMessage =
    document.getElementById("result-message");

const restartButton =
    document.getElementById("restart-btn");

const progressBar =
    document.getElementById("progress");


// ==================================================
// QUIZ QUESTIONS
// ==================================================

let quizQuestions = [];


// ==================================================
// QUIZ STATE VARIABLES
// ==================================================

let currentQuestionIndex = 0;

let score = 0;

let answersDisabled = false;


// ==================================================
// EVENT LISTENERS
// ==================================================

startButton.addEventListener("click", startQuiz);

restartButton.addEventListener("click", restartQuiz);


// ==================================================
// GET FOOTBALL QUESTIONS FROM API
// ==================================================

async function getQuestions() {

    try {

        const response = await fetch(
            "https://the-trivia-api.com/v2/questions?categories=sport_and_leisure&tags=football&limit=10"
        );


        // Check if request was successful

        if (!response.ok) {

            throw new Error(
                "Could not fetch football questions"
            );

        }


        // Convert response to JSON

        const data = await response.json();


        // Convert API questions into our format

        const questions =
            data.map(formatQuestion);


        // SHUFFLE THE QUESTIONS

        shuffleArray(questions);


        // Return shuffled questions

        return questions;


    } catch (error) {

        console.error(
            "Error fetching football questions:",
            error
        );

        return [];

    }

}


// ==================================================
// FORMAT API QUESTION
// ==================================================

function formatQuestion(apiQuestion) {


    // Put correct answer together
    // with incorrect answers

    const answers = [

        {

            text: apiQuestion.correctAnswer,

            correct: true

        },

        ...apiQuestion.incorrectAnswers.map(

            answer => ({

                text: answer,

                correct: false

            })

        )

    ];


    // SHUFFLE ANSWERS

    shuffleArray(answers);


    // Return question in our format

    return {

        question: apiQuestion.question.text,

        answers: answers

    };

}


// ==================================================
// SHUFFLE ARRAY
// ==================================================

function shuffleArray(array) {

    for (

        let i = array.length - 1;

        i > 0;

        i--

    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        // Swap positions

        [
            array[i],
            array[j]

        ] = [

            array[j],
            array[i]

        ];

    }

    return array;

}


// ==================================================
// DECODE HTML CHARACTERS
// ==================================================

function decodeHTML(text) {

    const textarea =
        document.createElement("textarea");

    textarea.innerHTML = text;

    return textarea.value;

}


// ==================================================
// START QUIZ
// ==================================================

async function startQuiz() {


    // Reset variables

    currentQuestionIndex = 0;

    score = 0;

    answersDisabled = false;


    // Reset score display

    scoreSpan.textContent = score;


    // Show loading message

    questionText.textContent =
        "Loading football questions...";

    answersContainer.innerHTML = "";


    // Hide start screen

    startScreen.classList.remove("active");


    // Hide result screen

    resultScreen.classList.remove("active");


    // Show quiz screen

    quizScreen.classList.add("active");


    // Get football questions from API

    quizQuestions =
        await getQuestions();


    // Check if questions were received

    if (quizQuestions.length === 0) {

        questionText.textContent =
            "Unable to load football questions. Please try again.";

        return;

    }


    // Update total questions

    totalQuestionsSpan.textContent =
        quizQuestions.length;

    maxScoreSpan.textContent =
        quizQuestions.length;


    // Show first question

    showQuestion();

}


// ==================================================
// SHOW QUESTION
// ==================================================

function showQuestion() {


    // Reset answer state

    answersDisabled = false;


    // Get current question

    const currentQuestion =
        quizQuestions[currentQuestionIndex];


    // Update question number

    currentQuestionSpan.textContent =
        currentQuestionIndex + 1;


    // Calculate progress

    const progressPercentage =
        (

            (currentQuestionIndex + 1)

            /

            quizQuestions.length

        ) * 100;


    // Update progress bar

    progressBar.style.width =
        progressPercentage + "%";


    // Display question

    questionText.textContent =
        currentQuestion.question;


    // Clear previous answers

    answersContainer.innerHTML = "";


    // Create answer buttons

    currentQuestion.answers.forEach(

        (answer) => {


            const button =
                document.createElement("button");


            // Put answer text inside button

            button.textContent =
                answer.text;


            // Add CSS class

            button.classList.add(
                "answer-btn"
            );


            // Store whether answer is correct

            button.dataset.correct =
                answer.correct;


            // Listen for answer click

            button.addEventListener(
                "click",
                selectAnswer
            );


            // Add button to container

            answersContainer.appendChild(
                button
            );

        }

    );

}


// ==================================================
// SELECT ANSWER
// ==================================================

function selectAnswer(event) {


    // Prevent multiple clicks

    if (answersDisabled) return;

    answersDisabled = true;


    // Get clicked button

    const selectedButton =
        event.target;


    // Check whether answer is correct

    const correct =
        selectedButton.dataset.correct ===
        "true";


    // Show correct and incorrect answers

    Array.from(

        answersContainer.children

    ).forEach((button) => {


        if (

            button.dataset.correct ===
            "true"

        ) {

            button.classList.add(
                "correct"
            );

        } else {

            button.classList.add(
                "incorrect"
            );

        }

    });


    // Increase score

    if (correct) {

        score++;

        scoreSpan.textContent =
            score;

    }


    // Wait 1 second

    setTimeout(() => {


        // Move to next question

        currentQuestionIndex++;


        // Check if there are more questions

        if (

            currentQuestionIndex <
            quizQuestions.length

        ) {

            showQuestion();

        } else {

            showResult();

        }

    }, 1000);

}


// ==================================================
// SHOW RESULT
// ==================================================

function showResult() {


    // Hide quiz screen

    quizScreen.classList.remove(
        "active"
    );


    // Show result screen

    resultScreen.classList.add(
        "active"
    );


    // Display final score

    finalScoreSpan.textContent =
        score;


    // Calculate percentage

    const percentage =
        (score / quizQuestions.length)
        * 100;


    // Display result message

    if (percentage === 100) {

        resultMessage.textContent =
            "Perfect score! You're a football genius!";

    } else if (percentage >= 80) {

        resultMessage.textContent =
            "Great job! You really know your football!";

    } else if (percentage >= 60) {

        resultMessage.textContent =
            "Good effort! You can do even better next time!";

    } else if (percentage >= 40) {

        resultMessage.textContent =
            "Keep trying! More football knowledge will get you there!";

    } else {

        resultMessage.textContent =
            "Don't be discouraged! Keep watching and learning football!";

    }

}


// ==================================================
// RESTART QUIZ
// ==================================================

function restartQuiz() {


    // Hide result screen

    resultScreen.classList.remove(
        "active"
    );


    // Start a new quiz

    startQuiz();

}