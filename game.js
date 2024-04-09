// Global game variables
let turn;
let gameBoard;


// Check the columns for possible moves
// dir = 1: ↓
// dir = -1: ↑
function checkColumn(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1) || (i == 0 && dir == 1) || (i == dimension - 1 && dir == -1)) &&
            gameBoard[i + dir][j] == oppositeColor) {
        for(let y = i + dir; y < dimension && y > 0; y += dir) {
            if (gameBoard[y][j] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[y][j] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                return opponentPawns;
            } else {
                return 0;
            }
        }
    }
    
    return 0;
}

// Check the rows for possible moves
// dir = 1: →
// dir = -1: ←
function checkRow(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((j > 0 && j < dimension -1) || (j == 0 && dir == 1) || (j == dimension - 1 && dir == -1)) &&
            gameBoard[i][j + dir] == oppositeColor) {
        for(let x = j + dir; x < dimension && x > 0; x += dir) {
            if (gameBoard[i][x] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[i][x] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                return opponentPawns;
            } else {
                return 0;
            }
        }
    }

    return 0;
}

// Check the diagonal \ for possible moves
// dir = 1: ↘
// dir = -1: ↖
function checkDiag1(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1 && j > 0 && j < dimension - 1) ||
            (i == 0 && dir == 1 && j < dimension - 1) ||
            (j == 0 && dir == 1 && i < dimension - 1) ||
            (i == dimension - 1 && dir == -1 && j > 0) ||
            (j == dimension - 1 && dir == -1 && i > 0)) &&
            gameBoard[i + dir][j + dir] == oppositeColor) {
        for(let y = i + dir, x = j + dir; y > 0 && y < dimension && x > 0 && x < dimension; y += dir, x += dir) {
            if (gameBoard[y][x] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[y][x] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                return opponentPawns;
            } else {
                return 0;
            }
        }
    }

    return 0;
}

// Check the diagonal / for possible moves
// dir = 1: ↙       la i aumenta e la j diminuisce
// dir = -1: ↗      la i diminuisce e la j aumenta
function checkDiag2(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1 && j > 0 && j < dimension - 1) ||
            (i == 0 && dir == 1 && j > 0) ||
            (j == 0 && dir == -1 && i > 0) ||
            (i == dimension - 1 && dir == -1 && j < dimension - 1) ||
            (j == dimension - 1 && dir == 1 && i < dimension - 1)) &&
            gameBoard[i + dir][j - dir] == oppositeColor) {
        for(let y = i + dir, x = j - dir; y > 0 && y < dimension && x > 0 && x < dimension; y += dir, x -= dir) {
            if (gameBoard[y][x] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[y][x] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                return opponentPawns;
            } else {
                return 0;
            }
        }
    }

    return 0;
}

function updatePossibleMoves() {
    for(let i=0; i < dimension; i++) {
        for(let j=0; j < dimension; j++) {
            if (gameBoard[i][j] != "b" && gameBoard[i][j] != "w") {
                checkColumn(i, j, 1);
                checkColumn(i, j, -1);
                checkRow(i, j, 1);
                checkRow(i, j, -1);
                checkDiag1(i, j, 1);
                checkDiag1(i, j, -1);
                checkDiag2(i, j, 1);
                checkDiag2(i, j, -1);
            }
        }
    }
}

function getPossibleMovesNumber() {
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if(gameBoard[i][j] == "p") count++;
        }
    }

    return count;
}

function updateGameboard() {
    updatePossibleMoves();

    let board = "<table id='board'>";

    for(let i=0; i < dimension; i++) {
        board += "<tr>";
        for(let j=0; j < dimension; j++) {
            board += "<td id='cell-" + i + "-" + j + "'";
            switch(gameBoard[i][j]) {
                case "b": 
                    board += "><img src='black.svg'></td>";
                    break;
                case "w":
                    board += "><img src='white.svg'></td>";
                    break;
                case "p":
                    board += " class='possible-move' onclick='addPawn(" + i + ", " + j + ")'>";
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
    document.getElementById("message").innerHTML = "It's " + (turn == "b" ? "Black" : "White") +  "'s turn";
}

function showWinner() {
    let countB = 0;
    let countW = 0;

    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (gameBoard[i][j] == "b") countB++;
            else if (gameBoard[i][j] == "w") countW++;
        }
    }

    document.getElementById("message").innerHTML = "The winner is " + (countB > countW ? "Black" : "White");
}

function newGame() {
    console.log(dimension)
    gameBoard = [];
    turn = "b";

    for(let i = 0; i < dimension; i++) {
        let row = [];
        for(let j = 0; j < dimension; j++) {
            if ((i == dimension/2 - 1 && j == dimension/2 - 1) || (i == dimension/2 && j == dimension/2)) {
                // initial black cells
                row.push("b");
            }  else if ((i == dimension/2 - 1 && j == dimension/2) || (i == dimension/2 && j == dimension/2 - 1)) {
                // initial white cells
                row.push("w");
            } else {
                // initial empty cells
                row.push("0");
            }
        }
        gameBoard.push(row);
    }
    console.log(gameBoard);
    updateGameboard();
}

function addPawn(i, j) {
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (gameBoard[i][j] == "p") gameBoard[i][j] = "0";
        }
    }

    let positiveY = checkColumn(i, j, 1);
    let negativeY = checkColumn(i, j, -1);
    let positiveX = checkRow(i, j, 1);
    let negativeX = checkRow(i, j, -1);
    let positiveDiag1 = checkDiag1(i, j, 1);
    let negativeDiag1 = checkDiag1(i, j, -1);
    let positiveDiag2 = checkDiag2(i, j, 1);
    let negativeDiag2 = checkDiag2(i, j, -1);
    //console.log(positive_y, negative_y, positive_x, negative_x);

    for(let y = 0; y <= positiveY; y++) gameBoard[i + y][j] = turn;
    for(let y = 0; y <= negativeY; y++) gameBoard[i - y][j] = turn;
    for(let x = 0; x <= positiveX; x++) gameBoard[i][j + x] = turn;
    for(let x = 0; x <= negativeX; x++) gameBoard[i][j - x] = turn;
    for(let d1 = 0; d1 <= positiveDiag1; d1++) gameBoard[i + d1][j + d1] = turn;
    for(let d1 = 0; d1 <= negativeDiag1; d1++) gameBoard[i - d1][j - d1] = turn;
    for(let d2 = 0; d2 <= positiveDiag2; d2++) gameBoard[i + d2][j - d2] = turn;
    for(let d2 = 0; d2 <= negativeDiag2; d2++) gameBoard[i - d2][j + d2] = turn;
    
    // Now it's the opponent's turn
    turn = turn == "b" ? "w" :"b";
    updateGameboard();

    // Check if the opponent has no possible moves
    let count = getPossibleMovesNumber();
    if (count == 0) {
        // Opponent has no possible move, turn is inverted
        turn = turn == "b" ? "w" :"b";
        updateGameboard();

        // Check if current player can make a move
        count = getPossibleMovesNumber();
        if (count == 0) {
            // Current player also has no moves
            showWinner();
        }
    }
}
