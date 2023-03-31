// Window Events

const resetButton = document.querySelectorAll(".reset-game");
resetButton.forEach((button) => {
  button.onclick = resetGame;
});

function resetGame() {
  DisplayController();
}

// Gameboard Object
function Gameboard() {
  //   const rows = 3;
  //   const columns = 3;

  const cells = 9;
  let board = [];

  for (let i = 0; i < cells; i++) {
    board.push(Cell());
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // Adds a player's token to a specific column and row.
  const placeIcon = (cell, player) => {
    board[cell].addMark(player);
  };

  // prints the current 2D array onto the console by putting token values onto each spot
  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getValue());
    console.log(boardWithCellValues);
  };

  return { getBoard, placeIcon, printBoard };
}

// Cell Object
function Cell() {
  let value = "";

  // changes value of the cell to the player's token
  const addMark = (player) => {
    value = player;
  };

  // how we will get the current value
  const getValue = () => value;

  return { addMark, getValue };
}

// will control game flow and win logic
function GameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = Gameboard();
  const boardArr = board.getBoard();
  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let winStatus = false;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = () => {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
      const condition = winConditions[i];
      const cellA = boardArr[condition[0]].getValue();
      const cellB = boardArr[condition[1]].getValue();
      const cellC = boardArr[condition[2]].getValue();

      if (cellA == "" && cellB == "" && cellC == "") continue;
      if (cellA == cellB && cellB == cellC) {
        roundWon = true;
        break;
      }
    }
    return roundWon;
  };

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // prints the board and displays player turn
  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const getWinStatus = () => {
    return winStatus;
  };

  const playRound = (cell) => {
    //places curr player's token into the array at the correct spot
    board.placeIcon(cell, getActivePlayer().token);

    // Winner Logic

    if (checkWin()) {
      winStatus = true;
    } else {
      switchPlayerTurn();
    }
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinStatus,
  };
}

function DisplayController() {
  const game = GameController();

  const boardDiv = document.querySelector(".gameboard-grid");
  const playerTurnDisplay = document.querySelector(".turn-status");
  const overlay = document.querySelector(".overlay");
  const modal = document.querySelector(".modal");
  const winMsg = document.querySelector(".win-msg");

  modal.classList.remove("active");
  overlay.classList.remove("active");

  

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDisplay.innerHTML = `${activePlayer.name}'s turn...`;

    board.forEach((cell, i) => {
      const cellButton = document.createElement("div");
      cellButton.classList.add("cell");

      cellButton.dataset.cell = i;

      cellButton.textContent = cell.getValue();
      boardDiv.appendChild(cellButton);
    });
  };

  const endGame = () => {
    const activePlayer = game.getActivePlayer();
    playerTurnDisplay.innerHTML = `${activePlayer.name} Wins!`;
    winMsg.innerHTML = `${activePlayer.name} Wins!`;
    modal.classList.add("active");
    overlay.classList.add("active");
  };

  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.cell;

    if (!selectedCell) return;

    game.playRound(selectedCell);
    updateScreen();
    if (game.getWinStatus() === true) endGame();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

window.onload = () => {
  DisplayController();
};
