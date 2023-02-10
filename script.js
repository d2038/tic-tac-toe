const Game = (() => {
  const displayController = () => {
    const gameboardDOM = document.getElementsByClassName('square');
    const render = (gameboardState) => {
      for (const cell of gameboardDOM) {
        const { index } = cell.dataset;
        cell.innerText = gameboardState[index] || '';
      }
    };
    return { render };
  };
  return { displayController };
})();

const Gameboard = (() => {
  const state = ['X', , 'O', 'O', , 'X', 'O', ,];
  return { state };
})();

const Player = (mark) => ({ mark });

Game.displayController().render(Gameboard.state);
