const Player = (name, mark) => {
  const playTurn = (board, cell) => {
    const idx = cell.dataset.index;
    if (board.boardArray[idx] === '') return idx;
    return null;
  };

  return { name, mark, playTurn };
};

const UI = (() => {
  const startScreen = document.querySelector('.start-screen');
  const playerOne = document.querySelector('#player1');
  const playerTwo = document.querySelector('#player2');
  const startBtn = document.querySelector('.start-btn');
  const gameboard = document.querySelector('.gameboard');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const gameStatus = document.querySelector('.game-status');

  const updateCell = (mark, idx) => {
    cells[idx].textContent = mark;
  };

  const updateGameStatus = (status) => {
    gameStatus.textContent = status;
  };

  const hideStartScreen = () => {
    startScreen.style.display = 'none';
  };

  const getPlayerOne = () => (playerOne.value === '' ? 'Player 1' : playerOne.value);

  const getPlayerTwo = () => (playerTwo.value === '' ? 'Player 2' : playerTwo.value);

  return {
    gameboard,
    startBtn,
    updateCell,
    updateGameStatus,
    hideStartScreen,
    getPlayerOne,
    getPlayerTwo,
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
    playerOne = Player(UI.getPlayerOne(), 'X');
    playerTwo = Player(UI.getPlayerTwo(), 'O');
    currentPlayer = playerOne;

    gameRound();
    UI.hideStartScreen();
  };

  return { gameInit };
})();

UI.startBtn.addEventListener('click', () => {
  Game.gameInit();
});
