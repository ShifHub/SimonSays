let gamePattern = [];
const buttonColors = ["red", "blue", "green", "yellow"];

let randomChosenColor = buttonColors[nextSequence()];
gamePattern.push(randomChosenColor);

function nextSequence() {
    const randomNumber = Math.floor(Math.random() * 4)
    return randomNumber
};
