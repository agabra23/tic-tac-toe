// Gameboard Object
function Gameboard() {
  //   const rows = 3;
  //   const columns = 3;

  const cells = 9;
  let board = [];

  for (let i = 0; i < cells; i++) {
    board.push(Cell());
  }

  const resetBoard = () => {
    board = [];
    for (let i = 0; i < cells; i++) {
      board.push(Cell());
    }
  };

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

  return { getBoard, placeIcon, printBoard, resetBoard };
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
  winStatus = "none",
  playerOneName = "Player 1",
  playerOneToken = "X",
  playerTwoName = "Player 2",
  playerTwoToken = "O"
) {
  const board = Gameboard();
  const boardArr = board.getBoard();
  const players = [
    { name: playerOneName, token: playerOneToken },
    { name: playerTwoName, token: playerTwoToken },
  ];

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
    let roundWon = "none";

    const containEmptyString = (element) => element.getValue() === "";

    if (!boardArr.some(containEmptyString)) roundWon = "tie";

    for (let i = 0; i < winConditions.length; i++) {
      const condition = winConditions[i];
      const cellA = boardArr[condition[0]].getValue();
      const cellB = boardArr[condition[1]].getValue();
      const cellC = boardArr[condition[2]].getValue();

      if (cellA == "" && cellB == "" && cellC == "") continue;
      if (cellA == cellB && cellB == cellC) {
        roundWon = "win";
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
    if (boardArr[cell].getValue() != "") return;
    board.placeIcon(cell, getActivePlayer().token);

    // Winner Logic
    winStatus = checkWin();
    if (winStatus === "none") switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    newBoard: board.resetBoard,
    getWinStatus,
  };
}

function DisplayController() {
  const boardDiv = document.querySelector(".gameboard-grid");
  const playerTurnDisplay = document.querySelector(".turn-status");
  const overlay = document.getElementById("overlay");
  const modal = document.querySelector(".modal");
  const winMsg = document.querySelector(".win-msg");
  const newGameBtn = document.getElementById("newGameBtn");

  const curtainOverlay = document.querySelector(".curtain");
  const playerOneInput = document.getElementById("playerOneName");
  const playerTwoInput = document.getElementById("playerTwoName");
  const playerOneTokenBtn = document.getElementById("playerOneToken");
  const playerTwoTokenBtn = document.getElementById("playerTwoToken");
  const playBtn = document.querySelector(".play-btn");

  let game = GameController();

  const resetButton = document.querySelectorAll(".reset-game");
  resetButton.forEach((button) => {
    button.onclick = () => {
      game.newBoard();
      game = GameController(
        "none",
        playerOneInput.value === "" ? "Player 1" : playerOneInput.value,
        playerOneTokenBtn.textContent,
        playerTwoInput.value === "" ? "Player 2" : playerTwoInput.value,
        playerTwoTokenBtn.textContent
      );
      updateScreen();
      modal.classList.remove("active");
      overlay.classList.remove("active");
    };
  });

  newGameBtn.onclick = () => {
    game.newBoard();
    game = GameController();
    updateScreen();
    modal.classList.remove("active");
    overlay.classList.remove("active");
    playerOneInput.value = "";
    playerTwoInput.value = "";
    if (playerOneTokenBtn.textContent === "O") swapTokens();
    curtainOverlay.classList.add("active");
  };

  const swapTokens = () => {
    if (playerOneTokenBtn.innerHTML === "X") {
      playerOneTokenBtn.innerHTML = "O";
      playerTwoTokenBtn.innerHTML = "X";
    } else {
      playerOneTokenBtn.innerHTML = "X";
      playerTwoTokenBtn.innerHTML = "O";
    }
  };

  playerOneTokenBtn.onclick = () => {
    swapTokens();
  };
  playerTwoTokenBtn.onclick = () => {
    swapTokens();
  };

  const openGameScreen = () => {
    game = GameController(
      "none",
      playerOneInput.value === "" ? "Player 1" : playerOneInput.value,
      playerOneTokenBtn.textContent,
      playerTwoInput.value === "" ? "Player 2" : playerTwoInput.value,
      playerTwoTokenBtn.textContent
    );
    updateScreen();
    curtainOverlay.classList.remove("active");
  };

  playBtn.onclick = (e) => {
    e.preventDefault();

    openGameScreen();
  };

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
    if (game.getWinStatus() === "tie") {
      playerTurnDisplay.innerHTML = `Tie!`;
      winMsg.innerHTML = `Tie!`;
    } else {
      playerTurnDisplay.innerHTML = `${activePlayer.name} Wins!`;
      winMsg.innerHTML = `${activePlayer.name} Wins!`;
    }

    modal.classList.add("active");
    overlay.classList.add("active");
  };

  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.cell;

    if (!selectedCell) return;
    game.playRound(selectedCell);
    console.log(game.getWinStatus());
    if (game.getWinStatus() != "none") endGame();
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

window.onload = () => {
  DisplayController();
};
