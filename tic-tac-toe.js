const DOM = (function() {
  const markSelectionDiv = document.querySelector('[id="mark-select"]');
  const gameStartButton = document.querySelector('#game-start');
  const board = document.querySelector('#gameboard');

  return { markSelectionDiv, gameStartButton, board }
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

  return { playerOne, playerTwo, changeMark, turnHandler }
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
    let index = e.target.dataset.index;
    let nextMark = players.turnHandler();
    boardState[index] = nextMark;
    console.log(boardState);
    render();
  }

  function checkForWin(player) {
    let mark = player.mark;
    for (let i = 0; i <= 6; i += 3) {
      if (boardState[i] === mark && boardState[i + 1] === mark && boardState[i + 2] === mark) {
        alert(`${player.name} won!`);
      }
    }

    for (let i = 0; i <= 2; i++) {
      if (boardState[i] === mark && boardState[i + 3] === mark && boardState[i + 6] === mark) {
        alert(`${player.name} won!`);
      }
    } 

    let i = 4;
    if (boardState[i] === mark && boardState[i + 4] === mark && boardState[i - 4] === mark ||
        boardState[i] === mark && boardState[i + 2] === mark && boardState[i - 2] === mark) {
      alert(`${player.name} won!`);
    }
  }

  function checkForDraw() {
    if (!boardState.includes(0)) {
      alert('draw!');
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

  delegateBoardEvents();

  render();
})();

const settings = (function() {
  function delegateMarkSelectionEvents() {
    DOM.markSelectionDiv.addEventListener('click', e => {
      if (e.target.matches('input[type="radio"]')) {
        players.changeMark(e.target.value);
        //
        console.log(players.playerOne.mark)
      }
    });
  }

  function init() {
    delegateMarkSelectionEvents();
  }

  init();
})();

const game = (function() {

})();

