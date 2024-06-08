"use strict";

const gameBoard = (function () {
    const rowsAndCols = 3;
    let gameboard = [];

    for (let rowsLimit = 0; rowsLimit < rowsAndCols; rowsLimit++) {
        gameboard.push(['', '', '']);
    }
    //Printing board for console
    const getBoard = () => gameboard;

    let getCell = (row, column) => gameboard[row][column];

    const clearBoard = () => gameboard = getBoard().map(row => row.map(cell => cell = ''));

    return {
        getBoard,
        getCell,
        clearBoard
    }
})();

const gameController = (function () {
    let isPlayersCreated = false;
    let isGameEnded = false;

    let player1 = {
        name: 'Player 1',
        score: 0,
        item: 'x',
        cssClass: 'cross'
    };

    let player2 = {
        name: 'Player 2',
        score: 0,
        item: '0', 
        cssClass: 'circle'
    };
    
    const winningConditionCheck = () => {
        return [
            [gameBoard.getCell(0, 0), gameBoard.getCell(0, 1), gameBoard.getCell(0, 2)], //firstRow
            [gameBoard.getCell(1, 0), gameBoard.getCell(1, 1), gameBoard.getCell(1, 2)], //secondRow
            [gameBoard.getCell(2, 0), gameBoard.getCell(2, 1), gameBoard.getCell(2, 2)], //thirdRow
            [gameBoard.getCell(0, 0), gameBoard.getCell(1, 0), gameBoard.getCell(2, 0)], //firstColumn
            [gameBoard.getCell(0, 1), gameBoard.getCell(1, 1), gameBoard.getCell(2, 1)], //secondColumn
            [gameBoard.getCell(0, 2), gameBoard.getCell(1, 2), gameBoard.getCell(2, 2)], //thirdColumn
            [gameBoard.getCell(0, 0), gameBoard.getCell(1, 1), gameBoard.getCell(2, 2)], //leftToRight
            [gameBoard.getCell(0, 2), gameBoard.getCell(1, 1), gameBoard.getCell(2, 0)] // rightToLeft
        ]
    };
    const setPlayersNames = (player, value) => {player.name = value};

    // First turn only for 'x'
    let choosePlayersTurn = player1.item === 'x' ? player1 : player2;

    const getActivePlayer = () => choosePlayersTurn;

    const increaseScore = () => getActivePlayer().score += 1;

    let setActivePlayer = () => {
        getActivePlayer() === player1 ? choosePlayersTurn = player2 : choosePlayersTurn = player1;
        console.log(`${getActivePlayer().name} now it's your turn!`);
    };

    const resetPlayersTurn = () => choosePlayersTurn = player1.item === 'x' ? player1 : player2;

    const getScore = () => [player1.score, player2.score]

    const getItems = () => `${player1.name} plays for ${player1.item} and ${player2.name} plays for ${player2.item}`;

    const checkForGameResult = (currentPlayer) => {
        // Placed item of active player getting checked on winning pattern of winningCondition
        const gameHasWinner = winningConditionCheck().some(condition => condition.every(itemType => itemType === currentPlayer.item));
        const gameHasNoWinner = winningConditionCheck().every(condition => condition.every(itemType => itemType !== ''));

        if (gameHasWinner) {
            console.log(`${getActivePlayer().name} has won`);
            increaseScore();
            getScore();
            resetPlayersTurn();
            isGameEnded = true;
            return 
        } else if (!gameHasWinner && gameHasNoWinner) {
            getScore();
            resetPlayersTurn();
            isGameEnded = true;
            return 'This game has no winner'
        }

        setActivePlayer();
    };

    let setItemToCell = (row, column) => {
        if (gameBoard.getCell(row, column) === '') {
            gameBoard.getBoard()[row][column] = getActivePlayer().item;
            checkForGameResult(getActivePlayer());
        } else {
            console.log(`This cell already have an item`);
            return 
        }
    };

    const createPlayers = (players) => {
        const firstPlayerName = document.querySelector(".input-name-player1").value;
        const secondPlayerName = document.querySelector(".input-name-player2").value;
        const values = [firstPlayerName, secondPlayerName];

        for(let playerIndex = 0; playerIndex < players.length; playerIndex++) {
            setPlayersNames(players[playerIndex], values[playerIndex]);
        };
    }

    const swapPlayersItems = () => {
        if(player1.item === 'x') {
            player1.item = '0';
            player1.cssClass = 'circle';

            player2.item = 'x';
            player2.cssClass = 'cross';
            choosePlayersTurn = player2;
        } else {
            player1.item = 'x';
            player1.cssClass = 'cross';
            choosePlayersTurn = player1;

            player2.item = '0';
            player2.cssClass = 'circle';
        }
    }

    const getPlayersCss = () => getActivePlayer().cssClass;

    const getGameStatus = () => isGameEnded;

    const getPlayerCreationStatus = () => isPlayersCreated;

    function playRound(row,column) {
        if(!isGameEnded) {
            isPlayersCreated === true ? null : createPlayers([player1, player2]);
            console.log(gameBoard.getBoard());
            setItemToCell(row,column);
            
        }
    }

    return {
        playRound,
        getGameStatus,
        getPlayerCreationStatus,
        getScore,
        getActivePlayer,
        getPlayersCss,
        swapPlayersItems
    }
})();

let ScreenController = (function(){
    const playersInput = document.querySelectorAll('input');
    const labels = document.querySelectorAll('label');
    const outerCells = document.querySelectorAll('.outer-cells');
    const [firstPlayerScore, secondPlayerScore] = document.querySelectorAll('section > p');

    const disableInputs = () => playersInput.forEach(input => input.disabled = true);
    
    const playGame = (e) => {
        const clickedCell = e.target;
        //Preventing click on already taken cell
        if (clickedCell.classList.contains('cross') || clickedCell.classList.contains('circle')) {return};

        const innerCells = clickedCell.querySelector('.inner-cells');
        //DOM clicked cells with data-attributes
        const [row, column] = [innerCells.getAttribute('data-value')[0], innerCells.getAttribute('data-value')[2]];
        if (!gameController.getGameStatus()) {
            gameBoard.getCell(row, column) === '' ?
            innerCells.classList.toggle(gameController.getActivePlayer().cssClass) :
            null;

            gameController.playRound(row, column);
            
            [firstPlayerScore.textContent, secondPlayerScore.textContent] = gameController.getScore();
        }

        // Player can't change Name if game has already started
        gameController.getPlayerCreationStatus() === true ? null : disableInputs();
    };
    outerCells.forEach(cell => cell.addEventListener('click', playGame)); 

    // Update Names and pass values to code
    const updateValueName = (e) => clickedCell.setAttribute('value', e.target.value);
    playersInput.forEach(input => input.addEventListener('input', updateValueName));
    
  
    
    //Preventing label to be clicked for input activation
    const disableLabelsClicks = (e) => e.preventDefault();
    labels.forEach( label => label.addEventListener('click', disableLabelsClicks));

    //Swap players items
    const [leftPlayer, rightPlayer] = document.querySelectorAll('.players-items');

    const swapItems = () => {
        //Swapping x and o
        gameController.swapPlayersItems()
        //Swapping data-attributes
        if (leftPlayer.getAttribute('data-item') === 'cross') {
            rightPlayer.setAttribute('data-item', 'cross');
            leftPlayer.setAttribute('data-item', 'circle');
        } else {
            rightPlayer.setAttribute('data-item', 'circle');
            leftPlayer.setAttribute('data-item', 'cross');
        }
    }
    document.querySelector('.change-item-btn')
            .addEventListener('click', swapItems);
})();

/** TODO list:
 * 1) Сделай динамичные инпуты с js
 *    https://www.youtube.com/watch?v=KPYhZ5SDZ9g
 * 2) Можно импортировать WinningCondition или отттуда как то инфу вытягивать
 * и когда пользователь побеждает то подсвечивать квадраты
 * 3) В конце глянуть его https://github.com/swarnim-me/tic-tac-toe/tree/main/js
 * 4) Min length у инпутов
 * 5) OnRestart enable inputs
 * 6) После этого пуш в гит и players-item-change
 * 7) По окончании читать css какие то трюки у другие и смотреть playerCreating
 * 8) Подсвечивать кто из игроков ходит
 * 9) Cursor pointer group css
 * 10) Put css into Css folder, updated HTML links
 * 11) make score reset on reset btn
 * 12) Download ubuntu, safari
 * 13) disable cells if gameIsOver
 * 14) Make simple animated arrow (->) which will be positioned on the left of player who has item 'x'. It will go left and right quickly like pointing to the player
 */