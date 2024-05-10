function isTerminalState(state) {
    let opponentState = structuredClone(state);
    opponentState.turn = opponentState.turn == "b" ? "w" : "b";
    return (getPossibleMovesNumber(state) == 0 && getPossibleMovesNumber(opponentState) == 0)
}

function getTerminalUtility(state) {
    let blackPawns = getBlackPawns(state);
    let whitePawns = getWhitePawns(state);

    return (blackPawns > whitePawns) ? Infinity : -Infinity;
}

// return a random number for each state
function randomHeuristic(state) {
    return Math.floor(Math.random() * 100);
}

// returns the difference between the number of the player's pawns and the opponent's
function morePawnsHeuristic(state) {
    let blackPawns = getBlackPawns(state);
    let whitePawns = getWhitePawns(state);

    return blackPawns - whitePawns;
}

// return the number of pawns that would be eaten by the move
function eatingHeuristic(state) {
    let blackPawnsGame = getBlackPawns(gameState);
    let whitePawnsGame = getWhitePawns(gameState);
    let blackPawnsState = getBlackPawns(state);
    let whitePawnsState = getWhitePawns(state);

    let deltaBlack = blackPawnsState - blackPawnsGame;
    let deltaWhite = whitePawnsGame - whitePawnsState;

    return (state.turn == "b") ? deltaBlack : deltaWhite;
}

// return an higher number when there are more pawns on the border of the gameboard
function conquestBorderHeuristic(state) {
    let blackBorder = getBlackPawnsBorder(state);
    let whiteBorder = getWhitePawnsBorder(state);

    return blackBorder - whiteBorder;
}

// return an higher number if it's possible to make the opponent skip a turn
function skipOpponentTurnHeuristic(state) {
    let tmpState = structuredClone(state);
    tmpState.turn = state.turn == "b" ? "w" : "b";

    if (getPossibleMovesNumber(tmpState) == 0 && state.turn == "b") return 100;
    else if (getPossibleMovesNumber(tmpState) == 0 && state.turn == "w") return -100;
    else return 0;
}

// complete heuristic
function completeHeuristic(state) {
    return morePawnsHeuristic(state) + eatingHeuristic(state) + conquestBorderHeuristic(state) + skipOpponentTurnHeuristic(state);
}

function iterativeDeepeningAlphaBeta(state, evaluationFunc) {
    // start time in seconds
    let startTime = new Date().getTime() / 1000;
    console.log(startTime);

    function alphaBetaSearch(state, alpha, beta, depth) {
        function maxValue(state, alpha, beta, depth) {
            let value = -Infinity;
            for(let successor of getSuccessors(state)) {
                value = Math.max(value, alphaBetaSearch(successor, alpha, beta, depth));
                if (value >= beta) return value;
                alpha = Math.max(alpha, value);
            }
            // console.log(state.turn, depth);
            return value;
        }

        function minValue(state, alpha, beta, depth) {
            let value = Infinity;
            for(let successor of getSuccessors(state)) {
                value = Math.min(value, alphaBetaSearch(successor, alpha, beta, depth - 1));
                if (value <= alpha) return value;
                beta = Math.min(beta, value);
            }
            // console.log(state.turn, depth);
            return value;
        }

        if (isTerminalState(state)) return getTerminalUtility(state);
        if (depth <= 0 || (new Date().getTime() / 1000) - startTime > MAX_ALLOWED_SECONDS) return evaluationFunc(state);
        if (state.turn == "b") {
            return maxValue(state, alpha, beta, depth);
        } else {
            return minValue(state, alpha, beta, depth);
        }
    }

    let bestMove = null;

    for(let depth = 1; depth <= MAX_DEPTH; depth++) {
        console.log("depth: " + depth);
        console.log(new Date().getTime() / 1000 - startTime);
        if ((new Date().getTime() / 1000) - startTime > MAX_ALLOWED_SECONDS) {
            break;
        }

        let val = -Infinity;
        for(let successor of getSuccessors(state)) {
            let score = alphaBetaSearch(successor, -Infinity, Infinity, depth);
            if (score > val) {
                val = score;
                bestMove = successor.move;
            }
        }
    }

    console.log(bestMove);
    return bestMove;
}
