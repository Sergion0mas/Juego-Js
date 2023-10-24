console.log(maps);
const canvas = document.querySelector("#game");
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up'); 
const btnDown = document.querySelector('#down'); 
const btnLeft = document.querySelector('#left'); 
const btnRight = document.querySelector('#right'); 

let canvasSize;
let elementsSize;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

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

    startGame()
}


function startGame() {
    
    game.textAlign = 'center';
    
    game.font = elementsSize + 'px Verdana';

    const map = maps[2];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    game.clearRect(0,0,canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);


            if (col == 'O') {
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }

            game.fillText(emoji, posX, posY);
        })
    });

    movePlayer();
}

function movePlayer(){
    const giftColisionX = playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1);
    const giftColisionY = playerPosition.y.toFixed(1) == giftPosition.y.toFixed(1);
    const giftColision = giftColisionX && giftColisionY;

    console.log("Player X:", playerPosition.x, "Player Y:", playerPosition.y);
    console.log("Gift X:", giftPosition.x, "Gift Y:", giftPosition.y);

    if(giftColision) {
        console.log('subiste de nivel');
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, 
    playerPosition.y);
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