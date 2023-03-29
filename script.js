let boardArr = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];

const renderGrid = (boardArr) => {
  const cells = document.querySelectorAll(".cell");
  let index = 0;
  cells.forEach((cell) => {
    cell.textContent = boardArr[index];
    index++;
  });
};

const gameBoard = (function (boardArr) {
  this.boardArr = boardArr;
  this.resetBoard = () => {
    boardArr = ["", "", "", "", "", "", "", "", ""];
  };
})();

const player = (name, icon) => {
  const sayHello = () => console.log("hello!");
  return { name, age, sayHello };
};

renderGrid();
