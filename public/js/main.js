const boardRows = 15;
const boardColumns = 15;

const squaresStates = Object.freeze({ EMPTY: 0, SNAKE: 1, FRUIT: 2 });
const { EMPTY, SNAKE, FRUIT } = squaresStates;

const board = new Array(boardRows);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(boardColumns).fill(EMPTY);
}

const snakeCoordinates = [];

for (let i = 0; i < 5; i++) {
  snakeCoordinates.push([
    Math.floor(boardRows / 2),
    Math.floor(boardColumns / 2) - 1 + i,
  ]);
  board[Math.floor(boardRows / 2)][Math.floor(boardColumns / 2) - 1 + i] =
    SNAKE;
}

// Current direction of the snake
let xCurrentSnakeDirection = 1;
let yCurrentSnakeDirection = 0;

// Direction of the last valid key pressed
let xLastKeyDirection;
let yLastKeyDirection;

function drawBoard(board) {
  const canvas = document.getElementById("game");
  canvas.height = 500;
  canvas.width = 500;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#E2E2E2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const squaresSideLength = canvas.height / boardColumns;

  for (
    let i = squaresSideLength;
    i < canvas.height - 1;
    i += squaresSideLength
  ) {
    // Draw rows
    ctx.beginPath();
    ctx.strokeStyle = "#01295F";
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();

    // Draw columns
    ctx.beginPath();
    ctx.strokeStyle = "#01295F";
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < boardRows; i++) {
    for (let j = 0; j < boardColumns; j++) {
      if (board[i][j] === SNAKE) {
        upperLeftCornerY = i * squaresSideLength;
        upperLeftCornerX = j * squaresSideLength;
        ctx.fillStyle = "#4361ee";
        ctx.fillRect(
          upperLeftCornerX,
          upperLeftCornerY,
          squaresSideLength,
          squaresSideLength
        );
      } else if (board[i][j] === FRUIT) {
        upperLeftCornerY = i * squaresSideLength;
        upperLeftCornerX = j * squaresSideLength;
        ctx.fillStyle = "red";
        ctx.fillRect(
          upperLeftCornerX,
          upperLeftCornerY,
          squaresSideLength,
          squaresSideLength
        );
      }
    }
  }
}

function moveSnake(xSnakeDirection, ySnakeDirection, snakeCoordinates, board) {
  let oldSnakeHead = snakeCoordinates[snakeCoordinates.length - 1];
  let newSnakeHead = [
    oldSnakeHead[0] + ySnakeDirection,
    oldSnakeHead[1] + xSnakeDirection,
  ];
  let oldSnakeTail = snakeCoordinates[0];

  snakeCoordinates.push(newSnakeHead);

  if (board[newSnakeHead[0]][newSnakeHead[1]] !== FRUIT) {
    snakeCoordinates.shift();
    board[oldSnakeTail[0]][oldSnakeTail[1]] = EMPTY;
  } else {
    putFruit(board);
  }

  board[newSnakeHead[0]][newSnakeHead[1]] = SNAKE;
}

function isItGameOver(
  xCurrentSnakeDirection,
  yCurrentSnakeDirection,
  snakeCoordinates,
  board
) {
  let [currentYSnakeHead, currentXSnakeHead] =
    snakeCoordinates[snakeCoordinates.length - 1];

  let newXSnakeHead = currentXSnakeHead + xCurrentSnakeDirection;
  let newYSnakeHead = currentYSnakeHead + yCurrentSnakeDirection;

  let gameOver = false;

  if (
    newXSnakeHead < 0 ||
    newXSnakeHead >= boardColumns ||
    newYSnakeHead < 0 ||
    newYSnakeHead >= boardRows
  ) {
    gameOver = true;
  }

  if (board[newYSnakeHead][newXSnakeHead] === SNAKE) {
    gameOver = true;
  }

  return gameOver;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function putFruit(board) {
  do {
    let xRand = Math.floor(Math.random() * boardColumns);
    let yRand = Math.floor(Math.random() * boardRows);
    if (board[xRand][yRand] === EMPTY) {
      board[xRand][yRand] = FRUIT;
      break;
    }
  } while (true);
}

async function gameLoop(snakeCoordinates, board) {
  putFruit(board);
  drawBoard(board);
  while (true) {
    [xCurrentSnakeDirection, yCurrentSnakeDirection] =
      xLastKeyDirection != null && yLastKeyDirection != null
        ? [xLastKeyDirection, yLastKeyDirection]
        : [xCurrentSnakeDirection, yCurrentSnakeDirection];

    if (
      !isItGameOver(
        xCurrentSnakeDirection,
        yCurrentSnakeDirection,
        snakeCoordinates,
        board
      )
    ) {
      moveSnake(
        xCurrentSnakeDirection,
        yCurrentSnakeDirection,
        snakeCoordinates,
        board
      );
    } else {
      break;
    }
    await sleep(100);
    drawBoard(board);
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" && xCurrentSnakeDirection === 0) {
    xLastKeyDirection = -1;
    yLastKeyDirection = 0;
  } else if (event.key === "ArrowRight" && xCurrentSnakeDirection === 0) {
    xLastKeyDirection = 1;
    yLastKeyDirection = 0;
  } else if (event.key === "ArrowUp" && yCurrentSnakeDirection === 0) {
    xLastKeyDirection = 0;
    yLastKeyDirection = -1;
  } else if (event.key === "ArrowDown" && yCurrentSnakeDirection === 0) {
    xLastKeyDirection = 0;
    yLastKeyDirection = 1;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  gameLoop(snakeCoordinates, board);
});
