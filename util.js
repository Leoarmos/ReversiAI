function getPossibleMovesNumber(board) {
    let count = 0;
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if(board[i][j] == "p") count++;
        }
    }

    return count;
}

function getPossibleMoves(board, move) {
    let moves = [];
    // Reset the possible moves
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (board[i][j] == "p") board[i][j] = "0";
        }
    }
    
    board[move.i][move.j] = move.color;

    for(let i=0; i < dimension; i++) {
        for(let j=0; j < dimension; j++) {
            if (board[i][j] != "b" && board[i][j] != "w") {
                checkColumn(i, j, 1);
                checkColumn(i, j, -1);
                checkRow(i, j, 1);
                checkRow(i, j, -1);
                checkDiag1(i, j, 1);
                checkDiag1(i, j, -1);
                checkDiag2(i, j, 1);
                checkDiag2(i, j, -1);

                if (board[i][j] == "p") moves.push({
                    i: i,
                    j: j,
                    color: move.color == "b" ? "b" : "w"
                })
            }
        }
    }

    return moves;
}