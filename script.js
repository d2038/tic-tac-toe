const Player = (mark) => ({ mark });

const Gameboard = (() => {
  const board = ['X', , 'O', 'O', , 'X', 'O', ,];
  const cells = Array.from(document.querySelectorAll('.cell'));

  const render = () => {
    board.forEach((mark, idx) => {
      cells[idx].textContent = mark;
    });
  };
  return { board, render };
})();

const Game = (() => ({}))();

Gameboard.render();
