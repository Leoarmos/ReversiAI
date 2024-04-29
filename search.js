function isTerminalState(state) {
    let opponentState = structuredClone(state);
    opponentState.turn = opponentState.turn == "b" ? "w" : "b";
    return (getPossibleMovesNumber(state) == 0 && getPossibleMovesNumber(opponentState) == 0)
}

function getTerminalUtility(state) {
    let blackPawns = getBlackPawns(state);
    let whitePawns = getWhitePawns(state);

    return (blackPawns > whitePawns && state.turn == "b") ? Infinity : -Infinity;
}

function randomHeuristic(state) {
    return Math.floor(Math.random() * 100);
}

function basicHeuristic(state) {
    let blackPawns = getBlackPawns(state);
    let whitePawns = getWhitePawns(state);

    return (blackPawns > whitePawns && state.turn == "b") ? 100 : -100;
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
        if (depth <= 0 || (new Date().getTime / 1000) - startTime > MAX_ALLOWED_SECONDS) return evaluationFunc(state);
        if (state.turn == "b") {
            return maxValue(state, alpha, beta, depth);
        } else {
            return minValue(state, alpha, beta, depth);
        }
    }

    let bestMove = null;

    for(let depth = 1; depth <= MAX_DEPTH; depth++) {
        if ((new Date().getTime / 1000) - startTime > MAX_ALLOWED_SECONDS) {
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
