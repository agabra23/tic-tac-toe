// Window Events

const resetButton = document.querySelector(".reset-game");
resetButton.onclick = resetGame;

function resetGame() {
  DisplayController();
}

// Gameboard Object
function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeIcon = (column, row, player) => {
    board[row][column].addMark(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, placeIcon, printBoard };
}

// Cell Object
function Cell() {
  let value = "";

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(playerOneName = "User", playerTwoName = "Computer") {
  const board = Gameboard();
  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column, row) => {
    board.placeIcon(column, row, getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function DisplayController() {
  const game = GameController();
  const boardDiv = document.querySelector(".gameboard-grid");
  const playerTurnDisplay = document.querySelector(".turn-status");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDisplay.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellButton = document.createElement("div");
        cellButton.classList.add("cell");

        cellButton.dataset.column = j;
        cellButton.dataset.row = i;

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn) return;

    game.playRound(selectedColumn, selectedRow);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

window.onload = () => {
  DisplayController();
};
