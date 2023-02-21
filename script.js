const Player = (name, mark) => {
  const playTurn = (board, cell) => {
    const idx = cell.dataset.index;
    if (board.boardArray[idx] === '') return idx;
    return null;
  };

  return { name, mark, playTurn };
};

const UI = (() => {
  const gameboard = document.querySelector('.gameboard');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const gameStatus = document.querySelector('.game-status');

  const updateCell = (mark, idx) => {
    cells[idx].textContent = mark;
  };

  const updateGameStatus = (status) => {
    gameStatus.textContent = status;
  };

  return {
    gameboard,
    updateCell,
    updateGameStatus,
  };
})();

const Gameboard = (() => {
  const boardArray = new Array(9).fill('');
  let winner = null;

  const render = () => {
    boardArray.forEach((mark, idx) => {
      UI.updateCell(mark, idx);
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
        boardArray[combo[0]] !== ''
        && boardArray[combo[0]] === boardArray[combo[1]]
        && boardArray[combo[0]] === boardArray[combo[2]]
      ) {
        winner = 'current';
      }
    });

    return winner || (boardArray.includes('') ? null : 'Tie');
  };

  return {
    boardArray,
    render,
    checkWin,
  };
})();

const Game = (() => {
  let playerOne;
  let playerTwo;
  let currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameRound = () => {
    const board = Gameboard;
    UI.updateGameStatus(`${currentPlayer.name}'s Turn`);
    const controller = new AbortController();

    UI.gameboard.addEventListener(
      'click',
      (event) => {
        if (event.target.className !== 'cell') return;
        const play = currentPlayer.playTurn(board, event.target);
        if (play === null) return;
        board.boardArray[play] = currentPlayer.mark;
        board.render();

        const winStatus = board.checkWin();
        if (winStatus === 'Tie') {
          UI.updateGameStatus('Tie!');
        } else if (winStatus === null) {
          switchTurn();
          UI.updateGameStatus(`${currentPlayer.name}'s Turn`);
        } else {
          UI.updateGameStatus(`Winner is ${currentPlayer.name}`);
          controller.abort();
        }
      },
      { signal: controller.signal },
    );
  };

  const gameInit = () => {
    playerOne = Player('temp1', 'X');
    playerTwo = Player('temp2', 'O');
    currentPlayer = playerOne;

    gameRound();
  };

  return { gameInit };
})();

Game.gameInit();
