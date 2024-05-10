// Check the columns for possible moves
// dir = 1: ↓
// dir = -1: ↑
function checkColumn(i, j, dir, state) {
    let oppositeColor = state.turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1) || (i == 0 && dir == 1) || (i == dimension - 1 && dir == -1)) &&
            state.gameBoard[i + dir][j] == oppositeColor) {
        for(let y = i + dir; y >= 0 && y < dimension; y += dir) {
            if (state.gameBoard[y][j] == oppositeColor) {
                opponentPawns++;
            } else if (state.gameBoard[y][j] == state.turn && opponentPawns > 0) {
                state.gameBoard[i][j] = "p";
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
function checkRow(i, j, dir, state) {
    let oppositeColor = state.turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((j > 0 && j < dimension -1) || (j == 0 && dir == 1) || (j == dimension - 1 && dir == -1)) &&
            state.gameBoard[i][j + dir] == oppositeColor) {
        for(let x = j + dir; x >= 0 && x < dimension; x += dir) {
            if (state.gameBoard[i][x] == oppositeColor) {
                opponentPawns++;
            } else if (state.gameBoard[i][x] == state.turn && opponentPawns > 0) {
                state.gameBoard[i][j] = "p";
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
function checkDiag1(i, j, dir, state) {
    let oppositeColor = state.turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1 && j > 0 && j < dimension - 1) ||
            (i == 0 && dir == 1 && j < dimension - 1) ||
            (j == 0 && dir == 1 && i < dimension - 1) ||
            (i == dimension - 1 && dir == -1 && j > 0) ||
            (j == dimension - 1 && dir == -1 && i > 0)) &&
            state.gameBoard[i + dir][j + dir] == oppositeColor) {
        for(let y = i + dir, x = j + dir; y >= 0 && y < dimension && x >= 0 && x < dimension; y += dir, x += dir) {
            if (state.gameBoard[y][x] == oppositeColor) {
                opponentPawns++;
            } else if (state.gameBoard[y][x] == state.turn && opponentPawns > 0) {
                state.gameBoard[i][j] = "p";
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
function checkDiag2(i, j, dir, state) {
    let oppositeColor = state.turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (((i > 0 && i < dimension - 1 && j > 0 && j < dimension - 1) ||
            (i == 0 && dir == 1 && j > 0) ||
            (j == 0 && dir == -1 && i > 0) ||
            (i == dimension - 1 && dir == -1 && j < dimension - 1) ||
            (j == dimension - 1 && dir == 1 && i < dimension - 1)) &&
            state.gameBoard[i + dir][j - dir] == oppositeColor) {
        for(let y = i + dir, x = j - dir; y >= 0 && y < dimension && x >= 0 && x < dimension; y += dir, x -= dir) {
            if (state.gameBoard[y][x] == oppositeColor) {
                opponentPawns++;
            } else if (state.gameBoard[y][x] == state.turn && opponentPawns > 0) {
                state.gameBoard[i][j] = "p";
                return opponentPawns;
            } else {
                return 0;
            }
        }
    }

    return 0;
}

function getPossibleMovesNumber(state) {
    updatePossibleMoves(state);
    
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == "p") count++;
        }
    }

    return count;
}

function getPossibleMoves(state) {
    updatePossibleMoves(state);

    let moves = [];
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == "p") moves.push({
                i: i,
                j: j,
            })
        }
    }

    return moves;
}

function getSuccessors(state) {
    let moves = getPossibleMoves(state);
    let successors = [];

    for(let move of moves) {
        let successor = structuredClone(state);
        addPawn(move.i, move.j, successor);
        successor.move = move;
        successors.push(successor);
    }

    return successors;
}

function getBlackPawns(state) {
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == "b") count++;
        }
    }
    return count;
}

function getWhitePawns(state) {
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == "w") count++;
        }
    }
    return count;
}

function getBlackPawnsBorder(state) {
    let count = 0;
    // first and last columns
    for(let i = 0; i < dimension; i++) {
        if (state.gameBoard[i][0] == "b") count ++;
        if (state.gameBoard[i][dimension - 1] == "b") count++;
    }

    // first and last rows
    for(let j = 0; j < dimension; j++) {
        if (state.gameBoard[0][j] == "b") count++;
        if (state.gameBoard[dimension - 1][j] == "b") count++;
    }

    return count;
}

function getWhitePawnsBorder(state) {
    let count = 0;
    // first and last columns
    for(let i = 0; i < dimension; i++) {
        if (state.gameBoard[i][0] == "w") count ++;
        if (state.gameBoard[i][dimension - 1] == "w") count++;
    }

    // first and last rows
    for(let j = 0; j < dimension; j++) {
        if (state.gameBoard[0][j] == "w") count++;
        if (state.gameBoard[dimension - 1][j] == "w") count++;
    }

    return count;
}
