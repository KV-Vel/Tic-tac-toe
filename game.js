//TO DO: make score reset on reset btn
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
    let player1 = {
        name: 'Player 1',
        score: 0,
        item: '0',
        cssItem: 'clip-path: circle(50% at 50% 50%); \
        -webkit-clip-path: circle(50% at 50% 50%); \
        background-color:#ffb703'
    };

    let player2 = {
        name: 'Player 2',
        score: 0,
        item: 'x', 
        cssItem: 'clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%); \
        -webkit-clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);\
        background-color:#ffb703'
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

    // First turn only for 'x'
    let choosePlayersTurn = player1.item === 'x' ? player1 : player2;

    const getActivePlayer = () => choosePlayersTurn;

    const increaseScore = () => getActivePlayer().score += 1;

    let setActivePlayer = () => {
        getActivePlayer() === player1 ? choosePlayersTurn = player2 : choosePlayersTurn = player1;
        console.log(`${getActivePlayer().name} now it's your turn!`);
    };

    const resetPlayersTurn = () => choosePlayersTurn = player1.item === 'x' ? player1 : player2;

    const getScore = () => console.log(`Overall score is ${player1.score} : ${player2.score}`);

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
            return
        } else if (!gameHasWinner && gameHasNoWinner) {
            console.log('This game has no winner');
            getScore();
            resetPlayersTurn();
            return
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

    function playRound(row,column) {
        console.log(gameBoard.getBoard());
        setItemToCell(row,column);
    }

    return {
        playRound,
        getScore,
        getActivePlayer,
        getItems,
    }
})();

let ScreenController = (function(){
    const htmlCells = document.querySelectorAll('.inner-cells');
    
    const addPlayersItemToDisplay = (e) => {
        //DOM clicked cells with data-attributes
        const [row, column] = [e.target.getAttribute('data-value')[0], e.target.getAttribute('data-value')[2]];
        
        gameBoard.getCell(row, column) === '' ? 
        e.target.style.cssText = gameController.getActivePlayer().cssItem : 
        null;

        gameController.playRound(row, column);
    };

    htmlCells.forEach(el => el.addEventListener('click', addPlayersItemToDisplay));
    
})();

// Продумать players object creation?
/**Сделай динамичные инпуты с js
 * https://www.youtube.com/watch?v=KPYhZ5SDZ9g
 */
/**Когда нажимают на кнопку смены имени, то нужно выделить input или добавить обратно caret-color */

/** Можно импортировать WinningCondition или отттуда как то инфу вытягивать
 * и когда пользователь побеждает то подсвечивать квадраты
 */
/** В конце глянуть его https://github.com/swarnim-me/tic-tac-toe/tree/main/js
*/