console.log(maps);
const lobby = document.querySelector(".lobby");
const container = document.querySelector(".container");
const canvas = document.querySelector("#game");
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up'); 
const btnDown = document.querySelector('#down'); 
const btnLeft = document.querySelector('#left'); 
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#timer'); 
const spanRecord = document.querySelector('#record'); 
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton'); 
const gameLostScreen = document.getElementById('gameLostScreen');
const restartButton1 = document.getElementById('restartButton1');
const startButton = document.getElementById('startButton');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;
let formattedRecordTime;
let playerTime;
let timerStarted = false;

startButton.addEventListener("click", function() {
    lobby.classList.add("hidden");
    container.classList.remove("hidden");
    timeStart = Date.now(); // Inicia el temporizador al hacer clic en el botón
    timerStarted = true; // Marca que el temporizador ha comenzado
    startGame();
});

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemyposition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10.5;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}


function startGame() {
    
    
    game.textAlign = 'center';
    
    game.font = elementsSize + 'px Verdana';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }
    if (!timeStart) {
       timeStart = Date.now();
       timeInterval = setInterval(showTime, 100);
       showRecord(); 
    }
    
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    enemyposition = [];
    game.clearRect(0,0,canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);


            if (col === 'O') {
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col === 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col === 'X') {
                enemyposition.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        })
    });

    movePlayer();
    showLives();
}

function Win(){
    console.log('subiste de nivel');
    level++;
    startGame();
}

function movePlayer(){
    const giftColisionX = playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1);
    const giftColisionY = playerPosition.y.toFixed(1) == giftPosition.y.toFixed(1);
    const giftColision = giftColisionX && giftColisionY;

    if(giftColision) {
        Win();
    }

    const enemyCollision = enemyposition.find(enemy => {
     const  enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
     const  enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
     return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        loss();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, 
    playerPosition.y);
}

function loss(){

        lives--;
    
        showLives();
    
        if (lives <= 0) {
            clearInterval(timeInterval);

            gameLostScreen.classList.remove('hidden1');
        }
        
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();  
}


function gameWin() {
    
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');

    if (recordTime) {
        playerTime = Date.now() - timeStart;

        const recordMinutes = Math.floor(recordTime / (1000 * 60));
        const recordSeconds = Math.floor((recordTime % (1000 * 60)) / 1000);
        const recordMilliseconds = recordTime % 1000;

        formattedRecordTime = `${recordMinutes}m ${recordSeconds}s ${recordMilliseconds}ms`;

        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            console.log(`Nuevo récord: ${formattedRecordTime}`);
        } else {
            console.log(`No superaste tu récord (${formattedRecordTime})`);
        }
    } else {
        playerTime = Date.now() - timeStart;
        localStorage.setItem('record_time', playerTime);
    }

    const minutes = Math.floor(playerTime / (1000 * 60));
    const seconds = Math.floor((playerTime % (1000 * 60)) / 1000);
    const milliseconds = playerTime % 1000;

    const formattedPlayerTime = `${minutes}m ${seconds}s ${milliseconds}ms`;

    console.log({ formattedRecordTime, formattedPlayerTime });

    gameOverScreen.classList.remove('hidden');
}

function restartGame() {
    lives = 3;
    level = 0;
    timeStart = undefined;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    
    gameOverScreen.classList.add('hidden');
    gameLostScreen.classList.add('hidden1');
    container.classList.remove("hidden");
    startGame();

    lobby.classList.add('hidden');
}
restartButton.addEventListener('click', restartGame);
restartButton1.addEventListener('click', restartGame);


function showLives() {
    spanLives.innerHTML = emojis["HEART"].repeat(lives);
  }

function showTime() {

    if (!timerStarted || !timeStart) {
        return;
    }

    const elapsedTime = Date.now() - timeStart;

    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const milliseconds = elapsedTime % 1000;

    const formattedTime = `${minutes}:${seconds}:${milliseconds}.`;;

    spanTime.innerHTML = formattedTime;
}

function showRecord() {
    const recordTime = localStorage.getItem('record_time');

    if (recordTime) {
        const recordMinutes = Math.floor(recordTime / (1000 * 60));
        const recordSeconds = Math.floor((recordTime % (1000 * 60)) / 1000);
        const recordMilliseconds = recordTime % 1000;

        const formattedRecordTime = `${recordMinutes}:${recordSeconds}:${recordMilliseconds}.`;

        spanRecord.innerHTML = formattedRecordTime;
    } else {
        spanRecord.innerHTML = "N/A";
    }
}



window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click',moveRight);

function moveByKeys(event){
    switch (event.key) {
        
        case "ArrowUp":
            moveUp();
        break; 

        case "ArrowLeft":
            moveLeft();
        break; 

        case "ArrowDown":
            moveDown();
        break; 

        case "ArrowRight":
            moveRight();
        break; 

        default:
        break;
    }
}

function moveUp() {
    if((playerPosition.y - elementsSize) < 1){
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
  }
  
function moveLeft() {
    if((playerPosition.x - elementsSize) < 1){
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
  }
  
function moveRight() {
    if((playerPosition.x + elementsSize) > canvasSize){
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
  }
  
function moveDown() {
    if((playerPosition.y + elementsSize) > canvasSize){
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
  }