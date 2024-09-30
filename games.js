let gamePattern = [];
const buttonColors = ["red", "blue", "green", "yellow"];
let currentlyPressedButton = null;
let currentIndex = 0;
let gameOver = false;
let gameStarted = false
let highScore = 0;
let score = 0;
let gameOn = true;
let resetRequested = false

const darkColors = {
    red: 'rgb(139, 0, 0)',
    green: 'rgb(0, 100, 0)',
    blue: 'rgb(0, 0, 139)',
    yellow: 'rgb(139, 139, 0)'
}

const brightColors = {
    red: 'rgb(255, 0, 0)',
    green: 'rgb(0, 255, 0)',
    blue: 'rgb(0, 0, 255)',
    yellow: 'rgb(255, 255, 0)'
}

function incrementScore() {
    score++
    highScore = score > highScore ? score : highScore;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    $('#currentScore'). text('Current Score: ' + score);
    $('#highScoreLabel').text('High Score: ' + highScore);
}

function addNextColor() {
    const randomNumber = Math.floor(Math.random() * 4);
    const randomColor = buttonColors[randomNumber];
    gamePattern.push(randomColor);
}

function lastColorChosen() {
    return gamePattern[gamePattern.length - 1];
}

async function showSequence() {
    gameOn = false;
    console.log('resetRequested is set to:')
    console.log(resetRequested)
    console.log('should show gamePattern')
    for (let color of gamePattern) {
        if (resetRequested) {
            resetRequested = false;
            gameOn = true;
            return;
        }
        var element = $('.' + color);
        await flashElement(element, color);
        await new Promise(resolve => setTimeout(resolve, 500)); // pause duration(ms)
    }; 
    gameOn = true;
}

function flashElement(element, color) {
    return new Promise(resolve => {
        element.css('background-color', brightColors[color]);
        setTimeout(function() {
            element.css('background-color', darkColors[color]);
            resolve();
        }, 500); // flash duration(ms)
    });
}

function colorIsCorrect(color) {
    return color === gamePattern[currentIndex]
}

function handleButtonClick() {
    if (gameOn) {
        const color = $(this).attr('id');
        console.log('Button clicked:', color);
        console.log(gamePattern)
        console.log(currentIndex)
        if (gameStarted) {
            currentlyPressedButton = $(this)
            lightUp(currentlyPressedButton, color);
            playSound(color)
            if (!colorIsCorrect(color)) {
                gameOver = true;
                gameOn = false;
                playSound('wrong');
                $('body').css('background-color', 'rgb(63, 1, 1)');
                $('#level-title')
                    .text('Game Over')
                    .removeClass('hidden');
            } else {
                incrementScore();
                currentIndex++;
                if (currentIndex == gamePattern.length) {
                    setTimeout(() => {
                        addNextColor();
                        showSequence();
                        currentIndex = 0;
                    }, 500);
                };
            };
        } else {
            resetRequested = false
            gameStarted = true
            addNextColor();
            console.log('After adding a color')
            console.log(gamePattern)
            showSequence();
            $('#level-title').addClass('hidden');
        };
    };
}

function handleButtonRelease() {
    if (gameOn && currentlyPressedButton) {
        const color = $(currentlyPressedButton).attr('id');
        currentlyPressedButton.css('background-color', darkColors[color]);
        currentlyPressedButton = null;
    }
}

function playSound(name) {
    var audio = new Audio('sounds/' + name + '.mp3');
    audio.play();
}

function lightUp(element, color) {
    element.css('background-color', brightColors[color]);
}

function lightOff(element, color) {
    element.css('background-color', darkColors[color]);
}

function resetGame() {
    resetRequested = true;
    $('body').css('background-color', 'rgb(1, 31, 63)');
    $('#level-title')
        .text('Press a color to start')
        .removeClass('hidden');
    currentlyPressedButton = null;
    currentIndex = 0;
    score = 0;
    updateScoreDisplay();
    gamePattern = [];
    gameStarted = false;
}

$(document).ready(function() {
    console.log('document is ready')

    //.btn is clicked any amount after the first
    $('.btn').on('mousedown', handleButtonClick);

    //mouse button released after clicking a .btn
    $(document).on('mouseup', handleButtonRelease);

    $('#reset-btn').on('mouseup', resetGame);
})
    
