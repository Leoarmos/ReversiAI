let dimension;
let turn;
let gameBoard;


function reset() {
    document.getElementById("turn-tracker").value = "";
}

function checkColumn(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (i < dimension - 1 && i > 1 && gameBoard[i + dir][j] == oppositeColor) {
        for(let y = i + dir; y < dimension && y > 0; y += dir) {
            if (gameBoard[y][j] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[y][j] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                break;
            } else {
                break;
            }
        }
    }
}

function checkRow(i, j, dir) {
    let oppositeColor = turn == "b" ? "w" : "b";
    let opponentPawns = 0;

    if (j < dimension - 1 && j > 1 && gameBoard[i][j + dir] == oppositeColor) {
        for(let x = j + dir; x < dimension && x > 0; x += dir) {
            if (gameBoard[i][x] == oppositeColor) {
                opponentPawns++;
            } else if (gameBoard[i][x] == turn && opponentPawns > 0) {
                gameBoard[i][j] = "p";
                break;
            } else {
                break;
            }
        }
    }
}

function updatePossibleMoves() {
    for(let i=0; i < dimension; i++) {
        for(let j=0; j < dimension; j++) {
            if (gameBoard[i][j] != "b" && gameBoard[i][j] != "w") {
                checkColumn(i, j, 1);
                checkColumn(i, j, -1);
                checkRow(i, j, 1);
                checkRow(i, j, -1);
            }
        }
    }
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
    document.getElementById("turn-tracker").value = "It's " + (turn == "b" ? "Black" : "White") +  "'s turn";
}

function newGame(n) {
    gameBoard = [];
    turn = "b";

    dimension = n;
    for(let i = 0; i < n; i++) {
        let row = [];
        for(let j = 0; j < n; j++) {
            if ((i == n/2 - 1 && j == n/2 - 1) || (i == n/2 && j == n/2)) {
                // initial black cells
                row.push("b");
            }  else if ((i == n/2 - 1 && j == n/2) || (i == n/2 && j == n/2 - 1)) {
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

function turnPawn() {

}

function addPawn(i, j) {
    for(let i = 0; i < dimension; i++) {
        for(let j = 0; j < dimension; j++) {
            if (gameBoard[i][j] == "p") gameBoard[i][j] = "0";
        }
    }
    gameBoard[i][j] = turn;
    turn = turn == "b" ? "w" :"b";
    updateGameboard();
}
