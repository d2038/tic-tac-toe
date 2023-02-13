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
  let winner = null;

  const render = () => {
    boardArray.forEach((mark, idx) => {
      cells[idx].textContent = mark;
    });
  };

  const checkWin = () => {
    const winArrays = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    winArrays.forEach((combo) => {
      if (
        boardArray[combo[0]]
        && boardArray[combo[0]] === boardArray[combo[1]]
        && boardArray[combo[0]] === boardArray[combo[2]]
      ) {
        winner = 'current';
      }
    });

    return winner || (boardArray.includes(undefined) ? null : 'Tie');
  };

  return {
    boardArray,
    gameboard,
    cells,
    render,
    checkWin,
  };
})();

const Game = (() => {
  let currentPlayer;
  let playerOne;
  let playerTwo;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameRound = () => {
    const board = Gameboard;
    const gameStatus = document.querySelector('.game-status');
    if (currentPlayer.mark !== '') {
      gameStatus.textContent = `${currentPlayer.mark}'s Turn`;
      console.log(currentPlayer.mark);
    }

    board.gameboard.addEventListener('click', (event) => {
      if (event.target.className !== 'cell') return;
      const play = currentPlayer.playTurn(board, event.target);
      if (!play) return;
      const winStatus = board.checkWin();
      if (winStatus === 'Tie') {
        gameStatus.textContent = 'Tie!';
      } else if (winStatus === null) {
        switchTurn();
        gameStatus.textContent = `${currentPlayer.mark}'s Turn`;
      } else {
        gameStatus.textContent = `Winner is ${currentPlayer.mark}`;
      }
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
