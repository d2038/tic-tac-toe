const Player = (name, mark) => {
  const playTurn = (board, cell) => {
    const idx = cell.dataset.index;
    if (board.boardArray[idx] === '') return idx;
    return null;
  };

  return { name, mark, playTurn };
};

const Gameboard = (() => {
  const boardArray = new Array(9).fill('');

  const checkWin = () => {
    let winner = null;
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
        winner = 'winner';
      }
    });

    return winner || (boardArray.includes('') ? null : 'tie');
  };

  return { boardArray, checkWin };
})();

const Game = (() => {
  let playerOne;
  let playerTwo;
  let currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const checkWin = () => {
    const winStatus = Gameboard.checkWin();
    if (winStatus === null) {
      switchTurn();
    }
    return [currentPlayer.name, winStatus];
  };

  const makeMove = (event) => {
    if (!event.target.classList.contains('cell')) return null;
    const playIdx = currentPlayer.playTurn(Gameboard, event.target);
    if (playIdx === null) return null;
    Gameboard.boardArray[playIdx] = currentPlayer.mark;
    return playIdx;
  };

  const restart = () => {
    Gameboard.boardArray.fill('');
    currentPlayer = playerOne;
    return currentPlayer.name;
  };

  const init = (playerOneName, playerTwoName) => {
    playerOne = Player(playerOneName, 'X');
    playerTwo = Player(playerTwoName, 'O');
    currentPlayer = playerOne;
  };

  return {
    init,
    makeMove,
    checkWin,
    restart,
  };
})();

const UI = (() => {
  const startScreen = document.querySelector('.start-screen');
  const playerOne = document.querySelector('#player1');
  const playerTwo = document.querySelector('#player2');
  const startBtn = document.querySelector('.start-btn');
  const gameboard = document.querySelector('.gameboard');
  const gameStatus = document.querySelector('.game-status');
  const restartBtn = document.querySelector('.restart-btn');
  const goBackBtn = document.querySelector('.go-back-btn');
  const cells = Array.from(document.querySelectorAll('.cell'));

  const renderBoard = (playIdx = null) => {
    if (playIdx) {
      cells[playIdx].textContent = Gameboard.boardArray[playIdx];
      return;
    }
    Gameboard.boardArray.forEach((mark, idx) => {
      cells[idx].textContent = mark;
    });
  };

  const updateGameStatus = (name, status = null) => {
    let msg;
    switch (status) {
      case null:
        msg = `${name}'s Turn`;
        break;
      case 'tie':
        msg = 'Tie!';
        break;
      case 'winner':
        msg = `Winner is ${name}!!`;
        break;
      default:
        msg = '';
    }

    gameStatus.textContent = msg;
  };

  const renderMove = (event) => {
    const playIdx = Game.makeMove(event);
    if (!playIdx) return;
    renderBoard(playIdx);
    const statusArray = Game.checkWin();
    if (statusArray[1] === 'winner') {
      gameboard.style.pointerEvents = 'none';
    }
    updateGameStatus(...statusArray);
  };

  const restart = () => {
    const playerOneName = Game.restart();
    updateGameStatus(playerOneName);
    renderBoard();
    gameboard.style.pointerEvents = 'auto';
  };

  const goBack = () => {
    restart();
    startScreen.style.display = 'block';
  };

  const startGame = () => {
    startScreen.style.display = 'none';
    const playerOneName = playerOne.value === '' ? 'Player 1' : playerOne.value;
    const playerTwoName = playerTwo.value === '' ? 'Player 2' : playerTwo.value;
    updateGameStatus(playerOneName);

    gameboard.addEventListener('click', renderMove);
    restartBtn.addEventListener('click', restart);
    goBackBtn.addEventListener('click', goBack);

    Game.init(playerOneName, playerTwoName);
  };

  const init = () => {
    startBtn.addEventListener('click', startGame);
  };

  return { init };
})();

UI.init();
