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

    let gameStatuses = {
        isGameEnded: false,
        isPlayersCreated: false
    };

    const isGameEnded = () => gameStatuses.isGameEnded;
    const setGameStatus = (value) => gameStatuses.isGameEnded = value;

    const isPlayersCreated = () => gameStatuses.isPlayersCreated;

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
    
    const winningCondition = () => {
        return [
            [[gameBoard.getCell(0, 0), gameBoard.getCell(0, 1), gameBoard.getCell(0, 2)], ['0,0', '0,1', '0,2']], //firstRow
            [[gameBoard.getCell(1, 0), gameBoard.getCell(1, 1), gameBoard.getCell(1, 2)], ['1,0', '1,1', '1,2']], //secondRow
            [[gameBoard.getCell(2, 0), gameBoard.getCell(2, 1), gameBoard.getCell(2, 2)], ['2,0', '2,1', '2,2']], //thirdRow
            [[gameBoard.getCell(0, 0), gameBoard.getCell(1, 0), gameBoard.getCell(2, 0)], ['0,0', '1,0', '2,0']], //firstColumn
            [[gameBoard.getCell(0, 1), gameBoard.getCell(1, 1), gameBoard.getCell(2, 1)], ['0,1', '1,1', '2,1']], //secondColumn
            [[gameBoard.getCell(0, 2), gameBoard.getCell(1, 2), gameBoard.getCell(2, 2)], ['0,2', '1,2', '2,2']], //thirdColumn
            [[gameBoard.getCell(0, 0), gameBoard.getCell(1, 1), gameBoard.getCell(2, 2)], ['0,0', '1,1', '2,2']], //leftToRight
            [[gameBoard.getCell(0, 2), gameBoard.getCell(1, 1), gameBoard.getCell(2, 0)], ['0,2', '1,1', '2,0']], // rightToLeft
        ]
    };

    const resetScore = () => {
        player1.score = 0;
        player2.score = 0;
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

    const checkForGameResult = (currentPlayer) => {
        // Placed item of active player getting checked on winning pattern of winningCondition
        const gameHasWinner = winningCondition().some((condition) => condition[0].every(itemType => itemType === currentPlayer.item));
        const gameHasNoWinner = winningCondition().every(condition => condition[0].every(itemType => itemType !== ''));
        
        if (gameHasWinner) {
            console.log(`${getActivePlayer().name} has won`);
            increaseScore();
            getScore();
            gameStatuses.isGameEnded = true;

            // Slice of winningCondition last items
            const winningConsoleCells = winningCondition().filter(condition => condition[0].every(item => item === currentPlayer.item))[0][1];
            return winningConsoleCells
        } else if (!gameHasWinner && gameHasNoWinner) {
            getScore();
            resetPlayersTurn();
            gameStatuses.isGameEnded = true;
            return 'This game has no winner'
        }

        setActivePlayer();
    };

    let setItemToCell = (row, column) => {
        if (gameBoard.getCell(row, column) === '') {
            gameBoard.getBoard()[row][column] = getActivePlayer().item;
            return checkForGameResult(getActivePlayer());
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

    function playRound(row,column) {
        if(!gameStatuses.isGameEnded) {
            gameStatuses.isPlayersCreated === true ? null : createPlayers([player1, player2]);
            console.log(gameBoard.getBoard());
            return setItemToCell(row,column);
        }
    }

    return {
        playRound,
        isGameEnded,
        setGameStatus,
        isPlayersCreated,
        getScore,
        getActivePlayer,
        getPlayersCss,
        resetScore,
        swapPlayersItems
    }
})();

let ScreenController = (function(){
    const playersInput = document.querySelectorAll('input');
    const labels = document.querySelectorAll('label');
    const outerCells = document.querySelectorAll('.outer-cells');
    const [leftPlayer, rightPlayer] = document.querySelectorAll('.players-items');
    const [firstPlayerScore, secondPlayerScore] = document.querySelectorAll('section > p');
    const changeItemBtn = document.querySelector('.change-item-btn');
    const [firstPlayerPointer, secondPlayerPointer] = document.querySelectorAll('.player-pointer');
    const tooltip = document.querySelector('.tooltip');
    const toolTipWrapper = document.querySelector('.appearing-tooltip');
    const showToolTipSymbol = document.querySelector('i');
    const newRoundBtn = document.querySelector('.new-round-btn');
    const resetBtn = document.querySelector('.reset-score');

    firstPlayerPointer.classList.toggle('highlight');

    const disableInteraction = (value) => {
        playersInput.forEach(input => input.disabled = value);
        changeItemBtn.disabled = value;
    };

    // Highlighting active player
    const highlightPlayer = () => {
        firstPlayerPointer.classList.toggle('highlight');
        secondPlayerPointer.classList.toggle('highlight');
    };

    const showWinnersMessage = (winningPlayer) => {
        const winnersMessageDiv = document.querySelector('.winner-message-div');
        winnersMessageDiv.textContent = !winningPlayer ? "" : `${winningPlayer} has won.`;
    }

    const playGame = (e) => {
        const clickedCell = e.target;
        let winningCells;
        //Preventing click on already taken cell
        if (clickedCell.classList.contains('cross') || clickedCell.classList.contains('circle')) return;

        const innerCells = clickedCell.querySelector('.inner-cells');
        //DOM clicked cells with data-attributes
        const [row, column] = [innerCells.getAttribute('data-value')[0], innerCells.getAttribute('data-value')[2]];

        //If game not ended
        if (!gameController.isGameEnded()) {

            gameBoard.getCell(row, column) === '' ?
            innerCells.classList.toggle(gameController.getActivePlayer().cssClass) :
            null;

            winningCells = gameController.playRound(row, column);
            highlightPlayer();
            
            [firstPlayerScore.textContent, secondPlayerScore.textContent] = gameController.getScore();
        }

        if (gameController.isGameEnded()) {
            showWinnersMessage(gameController.getActivePlayer().name);
            toggleWinningCells(winningCells);
        }

        // Player can't change Name if game has already started
        gameController.isPlayersCreated() === true ? null : disableInteraction(true);
        
    };
    
    outerCells.forEach(cell => cell.addEventListener('click', playGame)); 

    // Increase Width of inputs with new symbols added
    const increaseWidthOfInputs = (e) => {
        const numberOfChars = e.target.value.length;
        if (numberOfChars >= 8) {
            const updatedInputLength = `${numberOfChars}ch`;
            e.target.style.width = updatedInputLength;
        }
    };
    // Update Names and pass values to code
    const updateValueName = (e) => {
        e.target.setAttribute('value', e.target.value);
        increaseWidthOfInputs(e)
    };
    playersInput.forEach(input => input.addEventListener('input', updateValueName));
    
    //Preventing label to be clicked for input activation
    const disableLabelsClicks = (e) => e.preventDefault();
    labels.forEach( label => label.addEventListener('click', disableLabelsClicks));

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

        highlightPlayer();
    };
    
    changeItemBtn.addEventListener('click', swapItems);

    const toggleWinningCells = (winningCells) => {
        const winningDOMCells = document.querySelectorAll(`[data-outer-cell-value = "${winningCells[0][0]},${winningCells[0][2]}"],
                                                           [data-outer-cell-value = "${winningCells[1][0]},${winningCells[1][2]}"],
                                                           [data-outer-cell-value = "${winningCells[2][0]},${winningCells[2][2]}"]`
                                                        );

        winningDOMCells.forEach(cell => cell.classList.toggle('highlight-winning-cells'));
    };

    const showToolTip = () => {
        toolTipWrapper.style.cssText = "display: block;";
        showToolTipSymbol.style.cssText = "display: none";
    };

    const hideToolTip = () => {
        toolTipWrapper.style.cssText = "display: none;"
        showToolTipSymbol.style.cssText = "display: block";
    };
    tooltip.addEventListener('mouseover', showToolTip);
    tooltip.addEventListener('mouseout', hideToolTip);

    const restartRound = () => {
        const allInnerCells = document.querySelectorAll('.inner-cells');

        allInnerCells.forEach(innerCell => innerCell.classList = 'inner-cells');
        gameBoard.clearBoard();
        disableInteraction(false);
        showWinnersMessage();
        outerCells.forEach(cell => cell.classList.remove('highlight-winning-cells'));
        gameController.setGameStatus(false);
    };
    newRoundBtn.addEventListener('click', restartRound);

    const resetScore = () => {
        gameController.resetScore();
        [firstPlayerScore.textContent, secondPlayerScore.textContent] = gameController.getScore();
    };
    resetBtn.addEventListener('click',resetScore);
})();

/** TODO list:
 * 3) В конце глянуть его https://github.com/swarnim-me/tic-tac-toe/tree/main/js
 * 10) Put css into Css folder, updated HTML links
 * 12) Download ubuntu, safari
 * 17) calc for padding of .tooltip
 * 18) add bots? At least check minimax algorithm
 * 19) Make phone layout for game
 * 20) Add icon
 */