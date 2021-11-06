// creates players, return players
const players = (function() {
  function Player(name, mark) {
    let theirTurn = (mark === 'x');
    function startTurn() {
      this.theirTurn = true;
    }
    function endTurn() {
      this.theirTurn = false;
    }
    return { name, mark, theirTurn, startTurn, endTurn };
  }

  let player = Player('Player', 'x');
  let computer = Player('Computer', 'o');

  return { player, computer }
})();

// contorls game flow
const gameContoller = (function({ player, computer }) {
  const board = document.getElementById('gameboard');
  let nextMark = 'x';
  let boardState = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ]
  init();

  function turnHandler() {
    let turnOf = player.theirTurn ? player : computer;
    player.theirTurn = !player.theirTurn;
    computer.theirTurn = !computer.theirTurn;
    nextMark = turnOf.mark;
  }

  function render() {
    board.replaceChildren();
    for (let i = 0; i < 9; i++) {
      let cell = document.createElement('div');
      cell.setAttribute('data-index', i);
      cell.classList.add('cell');


      if (boardState[i] === 'x' || boardState[i] === 'o') {
        cell.textContent = boardState[i];
      }
      board.appendChild(cell);
    }
  }

  function placeMark(e) {
    let index = e.target.dataset.index;
    turnHandler();
    boardState[index] = nextMark;
    console.log(boardState);
    render();
  }

  function delegateBoardEvents() {
    board.addEventListener('click', e => { 
      if (e.target.matches('.cell') && !e.target.textContent) {
        placeMark(e);
        checkForWin()
      }
    });
  }

  function checkForWin() {
    for (let i = 0; i <= 6; i += 3) {
      if (boardState[i] === 'x' && boardState[i + 1] === 'x' && boardState[i + 2] === 'x') {
        alert('you won!');
      }
    }

    for (let i = 0; i <= 2; i++) {
      if (boardState[i] === 'x' && boardState[i + 3] === 'x' && boardState[i + 6] === 'x') {
        alert('you won!');
      }
    } 

    let i = 4;
    if (boardState[i] === 'x' && boardState[i + 4] === 'x' && boardState[i - 4] === 'x' ||
        boardState[i] === 'x' && boardState[i + 2] === 'x' && boardState[i - 2] === 'x') {
      alert('you won!');
    }
  }

  function init() {
    render();
    delegateBoardEvents();
  }
})(players);
