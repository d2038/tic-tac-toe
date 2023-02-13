const Player = (mark) => {
  const playTurn = (board, cell) => {
    const idx = cell.dataset.index;
    if (board.boardArray[idx] === undefined) {
      board.boardArray[idx] = mark;
      board.render();
      return true;
    }
    return false;
  };

  return { mark, playTurn };
};

const Gameboard = (() => {
  const boardArray = new Array(9);
  const gameboard = document.querySelector('.gameboard');
  const cells = Array.from(document.querySelectorAll('.cell'));

  const render = () => {
    boardArray.forEach((mark, idx) => {
      cells[idx].textContent = mark;
    });
  };

  return {
    boardArray,
    gameboard,
    cells,
    render,
  };
})();

const Game = (() => {
  let currentPlayer;
  let playerOne;
  let playerTwo;

  const gameRound = () => {
    const board = Gameboard;

    board.gameboard.addEventListener('click', (event) => {
      if (event.target.className !== 'cell') return;
      const play = currentPlayer.playTurn(board, event.target);
    });
  };

  const gameInit = () => {
    playerOne = Player('X');
    playerTwo = Player('O');
    currentPlayer = playerOne;

    gameRound();
  };

  return { gameInit };
})();

Game.gameInit();
