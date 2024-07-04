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

    if (((j > 0 && j < dimension - 1) || (j == 0 && dir == 1) || (j == dimension - 1 && dir == -1)) &&
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
        addPawn(move.i, move.j, successor, false);
        successor.move = move;
        successors.push(successor);
    }

    return successors;
}

function getPawns(state, color) {
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] == color) count++;
        }
    }

    return count;
}

function getPawnsBorder(state, color) {
    let count = 0;

    // first and last columns
    for(let i = 0; i < dimension; i++) {
        if (state.gameBoard[i][0] == color) count ++;
        if (state.gameBoard[i][dimension - 1] == color) count++;
    }

    // first and last rows
    for(let j = 0; j < dimension; j++) {
        if (state.gameBoard[0][j] == color) count++;
        if (state.gameBoard[dimension - 1][j] == color) count++;
    }

    return count;
}

function getPawnsCorner(state, color) {
    let count = 0;
    corners = [
        [0, 0], [0, dimension - 1],
        [dimension - 1, 0], [dimension - 1, dimension - 1]
    ];

    for(let [cRow, cCol] of corners) {
        if (state.gameBoard[cRow][cCol] == color) count++;
    }

    return count;
}

// returns the number of potential moves for a specific color
function getPotentialMobility(state, color) {
    let result = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (state.gameBoard[i][j] != "w" && state.gameBoard[i][j] != "b" && 
                    ((i > 0 && j > 0 && state.gameBoard[i - 1][j - 1] == color) || 
                    (i > 0 && state.gameBoard[i - 1][j] == color) ||
                    (i > 0 && j < dimension - 1 && state.gameBoard[i - 1][j + 1] == color) ||
                    (j > 0 && state.gameBoard[i][j - 1] == color) ||
                    (j < dimension - 1 && state.gameBoard[i][j + 1] == color) ||
                    (i < dimension - 1 && j > 0 && state.gameBoard[i + 1][j - 1] == color) ||
                    (i < dimension - 1 && state.gameBoard[i + 1][j] == color) ||
                    (i < dimension - 1 && j < dimension - 1 && state.gameBoard[i + 1][j + 1] == color))) {
                result++;
            }
        }
    }
    return result;
}

// returns the number of safe, semi-safe and unsafe pawns
function getPawnsStats(state, color) {
    let corners = [
        [0, 0], [0, dimension - 1],
        [dimension - 1, 0], [dimension - 1, dimension - 1]
    ];

    let directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],   // → ↓ ← ↑
        [1, 1], [1, -1], [-1, 1], [-1, -1]  // ↘ ↙ ↗ ↖
    ];

    let opponent = color == "b" ? "w" : "b";

    let result = {
        safePawns: 0,
        semisafePawns: 0,
        unsafePawns: 0,
    };

    let safePawn;

    // corners are always safe
    for (let [cRow, cCol] of corners) {
        if (state.gameBoard[cRow][cCol] == color) result.safePawns++;
    }

    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (corners.includes([i, j])) continue;
            safePawn = false;
            // borders are safe if they are connected to a corner
            if (i == 0 || i == dimension - 1 || j == 0 || j == dimension - 1) {
                for(let [cRow, cCol] of corners) {
                    // if the pawn is not on the border of the corner
                    if (i != cRow && j != cCol) continue;

                    // the corner is of the right color
                    if (state.gameBoard[cRow][cCol] == color) {
                        let safeBorder = 1;
                        let dirRow = cRow > i ? 1 : (cRow < i ? -1 : 0);
                        let dirCol = cCol > j ? 1 : (cCol < j ? -1 : 0);

                        let row = i + dirRow;
                        let col = j + dirCol;

                        while (row != cRow || col != cCol) {
                            if (state.gameBoard[row][col] != color) {
                                safeBorder = 0;
                                break;
                            }

                            row += dirRow;
                            col += dirCol;
                        }

                        safePawn = true;
                        result.safePawns += safeBorder;
                    }
                }
            }

            if (!safePawn) {
                // check if the pawn can be eaten in any direction
                let safeDir = true;
                let opponentDir = [];
                let possibleDir = [];

                for(let [dirRow, dirCol] of directions) {
                    let row = i + dirRow;
                    let col = j + dirCol;

                    while ((row >= 0 && row < dimension && col >= 0 && col < dimension)) {
                        if (state.gameBoard[row][col] == "p") {
                            possibleDir.push([dirRow, dirCol]);
                            break;
                        } else if (state.gameBoard[row][col] == opponent) {
                            opponentDir.push([dirRow, dirCol]);
                            break;
                        } else if (state.gameBoard[row][col] == "0") {
                            break;
                        }
                        row += dirRow;
                        col += dirCol;
                    }
                }

                for(let [oppDirRow, oppDirCol] of opponentDir) {
                    if (possibleDir.includes([-oppDirRow, -oppDirCol])) safeDir = false;
                }

                if (safeDir) result.safePawns++;
                else result.unsafePawns++;
            }
        }
    }
    return result;
}
