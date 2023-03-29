let boardArr = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];

const gameBoard = (function (boardArr) {
  this.boardArr = boardArr;

  this.resetBoard = () => {
    boardArr = ["", "", "", "", "", "", "", "", ""];
  };

  this.renderGrid = (function (boardArr) {
    console.log("working");
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, i) => {
      console.log(cell);
      cell.innerHTML = boardArr[i];
    });
  })(boardArr);
})(boardArr);

const player = (name, icon) => {
  const sayHello = () => console.log("hello!");
  return { name, age, sayHello };
};
