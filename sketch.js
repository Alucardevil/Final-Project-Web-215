const gridSize = 5;
const tileSize = 80;
let tiles = [];
let highScores = [];
let movesCount = 0;

function setup() {
    let canvas = createCanvas(gridSize * tileSize + 1, gridSize * tileSize + 1);
    canvas.parent('p5-canvas');
    tiles = Array.from({ length: gridSize * gridSize }, (_, i) => (i + 1) % (gridSize * gridSize));
    shuffleTiles();
    frameRate(10);
    loadHighScores();
    displayHighScores();
}

function draw() {
    background(255);
    drawBoard();
}

function drawBoard() {
    for (let i = 0; i < tiles.length; i++) {
        let row = floor(i / gridSize);
        let col = i % gridSize;
        let x = col * tileSize;
        let y = row * tileSize;

        stroke(0);
        strokeWeight(1);
        fill(tiles[i] === i + 1 ? '#90ee90' : '#add8e6');
        rect(x, y, tileSize, tileSize);

        if (tiles[i] !== 0) {
            fill(0);
            textSize(32);
            textAlign(CENTER, CENTER);
            text(tiles[i], x + tileSize / 2, y + tileSize / 2);
        }
    }
}

function shuffleTiles() {
    do {
        tiles.sort(() => random() - 0.5);
    } while (!isSolvable() || isSolved());
}

function keyPressed() {
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        if (moveTile(keyCode)) {
            movesCount++;
            if (isSolved()) {
                updateHighScores(movesCount);
                movesCount = 0;
            }
        }
    }
}

function moveTile(keyCode) {
    let emptyIndex = tiles.indexOf(0);
    let targetIndex = emptyIndex;

    if (keyCode === UP_ARROW) targetIndex += gridSize;
    if (keyCode === DOWN_ARROW) targetIndex -= gridSize;
    if (keyCode === LEFT_ARROW) targetIndex += 1;
    if (keyCode === RIGHT_ARROW) targetIndex -= 1;

    if (targetIndex >= 0 && targetIndex < tiles.length) {
        [tiles[emptyIndex], tiles[targetIndex]] = [tiles[targetIndex], tiles[emptyIndex]];
        return true;
    }
    return false;
}

function isSolved() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== 0 && tiles[i] !== i + 1) return false;
    }
    return true;
}

function updateHighScores(moves) {
    highScores.push({ moves, time: new Date().toLocaleString() });
    highScores.sort((a, b) => a.moves - b.moves);
    highScores = highScores.slice(0, 3);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

function displayHighScores() {
    let statusElement = select('#status');
    statusElement.html('Top 3 Scores:<br>');
    highScores.forEach((score, index) => {
        statusElement.html(`${index + 1}: ${score.moves} moves, ${score.time}<br>`, true);
    });
}

function loadHighScores() {
    highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
}

function isSolvable() {
   
    return true;
}
window.shuffleTiles = shuffleTiles;
