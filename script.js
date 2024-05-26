//TO DO: make score reset on reset btn
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
        item: '0'
    };

    let player2 = {
        name: 'Player 2',
        score: 0,
        item: 'x'
    };

    const winningConditionCheck = () => {
        return [
            firstRow = [gameBoard.getCell(0, 0), gameBoard.getCell(0, 1), gameBoard.getCell(0, 2)],
            secondRow = [gameBoard.getCell(1, 0), gameBoard.getCell(1, 1), gameBoard.getCell(1, 2)],
            thirdRow = [gameBoard.getCell(2, 0), gameBoard.getCell(2, 1), gameBoard.getCell(2, 2)],
            firstColumn = [gameBoard.getCell(0, 0), gameBoard.getCell(1, 0), gameBoard.getCell(2, 0)],
            secondColumn = [gameBoard.getCell(0, 1), gameBoard.getCell(1, 1), gameBoard.getCell(2, 1)],
            thirdColumn = [gameBoard.getCell(0, 2), gameBoard.getCell(1, 2), gameBoard.getCell(2, 2)],
            leftToRight = [gameBoard.getCell(0, 0), gameBoard.getCell(1, 1), gameBoard.getCell(2, 2)],
            rightToLeft = [gameBoard.getCell(0, 2), gameBoard.getCell(1, 1), gameBoard.getCell(2, 0)]
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
            resetPlayersTurn()
            return
        } else if (!gameHasWinner && gameHasNoWinner) {
            console.log('This game has no winner');
            getScore();
            resetPlayersTurn()
            return
        }

        setActivePlayer()
    };

    let setItemToCell = (row, column) => {
        if (gameBoard.getCell(row, column) === '') {
            gameBoard.getBoard()[row][column] = getActivePlayer().item;
        } else {
            console.log(`This cell already have an item`);
            return
        }
        checkForGameResult(getActivePlayer())
        console.log(gameBoard.getBoard());
    };

    function startGame() {
        gameBoard.clearBoard();
        console.log(`${getActivePlayer().name} it's your turn!`);
        console.log(gameBoard.getBoard());
    }

    return {
        startGame,
        setItemToCell,
        getScore,
        getItems
    }
})();