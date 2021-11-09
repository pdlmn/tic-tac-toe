const DOM = (function() {
  const markSelectionDiv = document.querySelector('#mark-select');
  const markSelectionInputs = document.querySelectorAll('input[name="mark-select"]');
  const markInfoDiv = document.querySelector('#mark-info');
  const startGameButton = document.querySelector('#game-start');
  const gameStartInfoDiv = document.querySelector('#game-start-info');
  const winnerInfoDiv = document.querySelector('#winner-info');
  const board = document.querySelector('#gameboard');

  return { 
    markSelectionDiv,
    markSelectionInputs,
    markInfoDiv, 
    startGameButton,
    gameStartInfoDiv,
    winnerInfoDiv,
    board 
  }
})();

const players = (function() {
  function Player(name, mark) {
    let theirTurn = (mark === 'x');
    return { name, mark, theirTurn };
  }

  let playerOne = Player('Player one', 'x');
  let playerTwo = Player('Player two', 'o');

  function changeMark(newMark) {
    if (newMark === 'x') {
      [this.playerOne.mark, this.playerTwo.mark] = ['x', 'o'];
      [this.playerOne.theirTurn, this.playerTwo.theirTurn] = [true, false];
    } 
    if (newMark === 'o') {
      [this.playerOne.mark, this.playerTwo.mark] = ['o', 'x'];
      [this.playerOne.theirTurn, this.playerTwo.theirTurn] = [false, true];
    }
  }

  function turnHandler() {
    let turnOf = this.playerOne.theirTurn ? this.playerOne : this.playerTwo;
    this.playerOne.theirTurn = !this.playerOne.theirTurn;
    this.playerTwo.theirTurn = !this.playerTwo.theirTurn;
    console.log(playerOne, playerTwo)
    return turnOf.mark;
  }

  function resetTurns() {
    this.playerOne.theirTurn = (this.playerOne.mark === 'x');
    this.playerTwo.theirTurn = (this.playerTwo.mark === 'x');
  }

  return { playerOne, playerTwo, changeMark, turnHandler, resetTurns }
})();

const gameBoard = (function() {
  let boardState = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ]

  function render() {
    DOM.board.replaceChildren();
    for (let i = 0; i < 9; i++) {
      let cell = document.createElement('div');
      cell.setAttribute('data-index', i);
      cell.classList.add('cell');
      if (boardState[i] === 'x' || boardState[i] === 'o') {
        cell.textContent = boardState[i];
      }
      DOM.board.appendChild(cell);
    }
  }

  function placeMark(e) {
    if (settings.gameStarted === true) {
      let index = e.target.dataset.index;
      let nextMark = players.turnHandler();
      boardState[index] = nextMark;
      render();
    }
  }

  function checkForWin(player) {
    let mark = player.mark;
    for (let i = 0; i <= 6; i += 3) {
      if (boardState[i] === mark && boardState[i + 1] === mark && boardState[i + 2] === mark) {
        DOM.winnerInfoDiv.textContent = `${player.name} won!`;
        settings.endGame();
      }
    }

    for (let i = 0; i <= 2; i++) {
      if (boardState[i] === mark && boardState[i + 3] === mark && boardState[i + 6] === mark) {
        DOM.winnerInfoDiv.textContent = `${player.name} won!`;
        settings.endGame();
      }
    } 

    let i = 4;
    if (boardState[i] === mark && boardState[i + 4] === mark && boardState[i - 4] === mark ||
        boardState[i] === mark && boardState[i + 2] === mark && boardState[i - 2] === mark) {
          DOM.winnerInfoDiv.textContent = `${player.name} won!`;
          settings.endGame();
    }
  }

  function resetBoard() {
    boardState = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ]
    render();
  }

  function checkForDraw() {
    if (!boardState.includes(0)) {
      DOM.winnerInfoDiv.textContent = 'Draw!';
      settings.endGame();
    }
  }

  function delegateBoardEvents() {
    DOM.board.addEventListener('click', e => { 
      if (e.target.matches('.cell') && !e.target.textContent) {
        placeMark(e);
        checkForWin(players.playerOne);
        checkForWin(players.playerTwo);
        checkForDraw();
      }
    });
  }

  return { delegateBoardEvents, render, resetBoard }
})();

const settings = (function() {
  let gameStarted = false;

  function startGame() {
    this.gameStarted = true;
    DOM.gameStartInfoDiv.textContent = 'Game has been started!'
    DOM.gameStartInfoDiv.classList.add('started');
    DOM.gameStartInfoDiv.classList.remove('not-started');
    DOM.startGameButton.disabled = true;
    DOM.startGameButton.textContent = 'Game is ongoing';
    DOM.winnerInfoDiv.textContent = '';
    DOM.markSelectionInputs.forEach(input => input.disabled = true)
    players.resetTurns();
    gameBoard.resetBoard();
  }

  function endGame() {
    this.gameStarted = false;
    DOM.gameStartInfoDiv.textContent = 'Game ended! Want to restart?'
    DOM.gameStartInfoDiv.classList.remove('started');
    DOM.gameStartInfoDiv.classList.add('not-started');
    DOM.startGameButton.disabled = false;
    DOM.startGameButton.textContent = 'Restart game';
    DOM.markSelectionInputs.forEach(input => input.disabled = false)
  }

  function delegateMarkSelectionEvents() {
    DOM.markSelectionDiv.addEventListener('click', e => {
      if (e.target.matches('input[type="radio"]')) {
        let mark = e.target.value;
        players.changeMark(mark);
        DOM.markInfoDiv.innerHTML = `You chose <span class="">${mark}</span>.`;
      }
    });
  }

  return { gameStarted, startGame, endGame, delegateMarkSelectionEvents }
})();

const game = (function() {
  gameBoard.delegateBoardEvents();
  gameBoard.render();
  settings.delegateMarkSelectionEvents();
  DOM.startGameButton.addEventListener('click', () => settings.startGame());
})();

