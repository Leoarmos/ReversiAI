// Global game variables
let gameState = {
    gameBoard: null,
    turn: null,
};
let blackHeuristic = null;
let whiteHeuristic = null;

const MAX_DEPTH = 10;
const MAX_ALLOWED_SECONDS = 3;

// Put a "p" where there is a possible move in the gameboard of the state parameter
function updatePossibleMoves(state) {
    // Reset the possible moves
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == "p") state.gameBoard[i][j] = "0";
        }
    }
    
    for(let i=0; i < dimension; i++) {
        for(let j=0; j < dimension; j++) {
            if (state.gameBoard[i][j] != "b" && state.gameBoard[i][j] != "w") {
                checkColumn(i, j, 1, state);
                checkColumn(i, j, -1, state);
                checkRow(i, j, 1, state);
                checkRow(i, j, -1, state);
                checkDiag1(i, j, 1, state);
                checkDiag1(i, j, -1, state);
                checkDiag2(i, j, 1, state);
                checkDiag2(i, j, -1, state);
            }
        }
    }
}

// Draw the gameboard
function updateGameboard(state) {
    updatePossibleMoves(state);
    
    let board = "<table id='board'>";

    for(let i=0; i < dimension; i++) {
        board += "<tr>";
        for(let j=0; j < dimension; j++) {
            board += "<td id='cell-" + i + "-" + j + "'";
            switch(state.gameBoard[i][j]) {
                case "b": 
                    board += "><img src='black.svg'></td>";
                    break;
                case "w":
                    board += "><img src='white.svg'></td>";
                    break;
                case "p":
                    board += " class='possible-move' onclick='addPawn(" + i + ", " + j + ", gameState, true)'>";
                    board += "<img src='outline.svg'></td>";
                    break;
                case "0":
                    board += "></td>";
                    break;
            }
        }
        board += "</tr>";
    }

    board += "</table>";
    document.getElementById("board-container").innerHTML = board;
    document.getElementById("message").innerHTML = "It's " + (state.turn == "b" ? "Black" : "White") +  "'s turn";
}

function showWinner() {
    let countB = 0;
    let countW = 0;

    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (gameState.gameBoard[i][j] == "b") countB++;
            else if (gameState.gameBoard[i][j] == "w") countW++;
        }
    }

    document.getElementById("message").innerHTML = "The winner is " + (countB > countW ? "Black" : "White") + " – Bl: " + countB + " Wh: " + countW;
}

// Reset everything for a new game to start
function newGame() {
    gameState.gameBoard = [];
    gameState.turn = "b";

    for(let i = 0; i < dimension; i++) {
        let row = [];
        for(let j = 0; j < dimension; j++) {
            if ((i == dimension/2 - 1 && j == dimension/2 - 1) || (i == dimension/2 && j == dimension/2)) {
                // initial black cells
                row.push("w");
            }  else if ((i == dimension/2 - 1 && j == dimension/2) || (i == dimension/2 && j == dimension/2 - 1)) {
                // initial white cells
                row.push("b");
            } else {
                // initial empty cells
                row.push("0");
            }
        }
        gameState.gameBoard.push(row);
    }
    updateGameboard(gameState);
}

// Add a pawn in the selected cell in the gameboard of the state parameter
function addPawn(i, j, state, toDraw) {
    let positiveY = checkColumn(i, j, 1, state);
    let negativeY = checkColumn(i, j, -1, state);
    let positiveX = checkRow(i, j, 1, state);
    let negativeX = checkRow(i, j, -1, state);
    let positiveDiag1 = checkDiag1(i, j, 1, state);
    let negativeDiag1 = checkDiag1(i, j, -1, state);
    let positiveDiag2 = checkDiag2(i, j, 1, state);
    let negativeDiag2 = checkDiag2(i, j, -1, state);
    // console.log(positiveY, negativeY, positiveX, negativeX, positiveDiag1, negativeDiag1, positiveDiag2, negativeDiag2);

    for(let y = 0; y <= positiveY; y++) state.gameBoard[i + y][j] = state.turn;
    for(let y = 0; y <= negativeY; y++) state.gameBoard[i - y][j] = state.turn;
    for(let x = 0; x <= positiveX; x++) state.gameBoard[i][j + x] = state.turn;
    for(let x = 0; x <= negativeX; x++) state.gameBoard[i][j - x] = state.turn;
    for(let d1 = 0; d1 <= positiveDiag1; d1++) state.gameBoard[i + d1][j + d1] = state.turn;
    for(let d1 = 0; d1 <= negativeDiag1; d1++) state.gameBoard[i - d1][j - d1] = state.turn;
    for(let d2 = 0; d2 <= positiveDiag2; d2++) state.gameBoard[i + d2][j - d2] = state.turn;
    for(let d2 = 0; d2 <= negativeDiag2; d2++) state.gameBoard[i - d2][j + d2] = state.turn;

    // Now it's the opponent's turn
    state.turn = state.turn == "b" ? "w" :"b";
    if (toDraw) {
        updateGameboard(state);
    } else {
        updatePossibleMoves(state);
    }

    // Check if the opponent has no possible moves
    let count = getPossibleMovesNumber(state);
    if (count == 0) {
        // Opponent has no possible move, turn is inverted
        state.turn = state.turn == "b" ? "w" : "b";
        if (toDraw) {
            updateGameboard(state);
        } else {
            updatePossibleMoves(state);
        }

        // Check if current player can make a move
        count = getPossibleMovesNumber(state);
        if (count == 0) {
            // Current player also has no moves
            showWinner();
        }
    }
}

function reversiStep(turn) {
    console.log(turn + " turn");
    let move = null;
    if (turn == "b") {
        switch (blackHeuristic) {
            case "randomHeuristic":
                evaluationFunc = randomHeuristic;
                break;
            case "morePawnsHeuristic":
                evaluationFunc = morePawnsHeuristic;
                break;
            case "eatingHeuristic":
                evaluationFunc = eatingHeuristic;
                break;
            case "conquestBorderHeuristic":
                evaluationFunc = conquestBorderHeuristic;
                break;
            case "conquestCornerHeuristic":
                evaluationFunc = conquestCornerHeuristic;
                break;
            case "skipOpponentTurnHeuristic":
                evaluationFunc = skipOpponentTurnHeuristic;
                break;
            case "mobilityHeuristic":
                evaluationFunc = mobilityHeuristic;
                break;
            case "safePawnsHeuristic":
                evaluationFunc = safePawnsHeuristic;
                break;
            case "basicHeuristic":
                evaluationFunc = basicHeuristic;
                break;
            case "weightedHeuristic":
                evaluationFunc = weightedHeuristic;
                break;
        }
        move = iterativeDeepeningAlphaBeta(gameState, evaluationFunc);
    } else {
        switch (whiteHeuristic) {
            case "randomHeuristic": 
                evaluationFunc = randomHeuristic;
                break;
            case "morePawnsHeuristic":
                evaluationFunc = morePawnsHeuristic;
                break;
            case "eatingHeuristic":
                evaluationFunc = eatingHeuristic;
                break;
            case "conquestBorderHeuristic":
                evaluationFunc = conquestBorderHeuristic;
                break;
            case "conquestCornerHeuristic":
                evaluationFunc = conquestCornerHeuristic;
                break;
            case "skipOpponentTurnHeuristic":
                evaluationFunc = skipOpponentTurnHeuristic;
                break;
            case "mobilityHeuristic":
                evaluationFunc = mobilityHeuristic;
                break;
            case "safePawnsHeuristic":
                evaluationFunc = safePawnsHeuristic;
                break;
            case "basicHeuristic":
                evaluationFunc = basicHeuristic;
                break;
            case "weightedHeuristic":
                evaluationFunc = weightedHeuristic;
                break;
        }
        move = iterativeDeepeningAlphaBeta(gameState, evaluationFunc);
    }

    if(move != null) {
        addPawn(move.i, move.j, gameState, true);
        setTimeout(() => reversiStep(gameState.turn), MAX_ALLOWED_SECONDS);
        console.log("finito");
    }
}

function autoReversi() {
    blackHeuristic = document.getElementById("select-AI1").value;
    whiteHeuristic = document.getElementById("select-AI2").value;
    // console.log(blackHeuristic, whiteHeuristic);

    setTimeout(() => {
        reversiStep(gameState.turn);
    }, 1000);
    //setTimeout(() => reversiStep(gameState.turn), 1000);
}
