function isTerminalState(state) {
    let opponentState = structuredClone(state);
    opponentState.turn = opponentState.turn == "b" ? "w" : "b";
    return (getPossibleMovesNumber(state) == 0 && getPossibleMovesNumber(opponentState) == 0)
}

function getTerminalUtility(state) {
    let blackPawns = getPawns(state, "b");
    let whitePawns = getPawns(state, "w");

    return (blackPawns > whitePawns) ? Infinity : -Infinity;
}

// return a random number for each state
function randomHeuristic(state) {
    return Math.floor(Math.random() * 100);
}

// returns the difference between the number of the player's pawns and the opponent's
function morePawnsHeuristic(state) {
    let blackPawns = getPawns(state, "b");
    let whitePawns = getPawns(state, "w");

    //return blackPawns - whitePawns;
    return 100 * (blackPawns - whitePawns) / (blackPawns + whitePawns);
}

// return the number of pawns that would be eaten by the move
function eatingHeuristic(state) {
    let blackPawnsGame = getPawns(gameState, "b");
    let whitePawnsGame = getPawns(gameState, "w");
    let blackPawnsState = getPawns(state, "b");
    let whitePawnsState = getPawns(state, "w");

    let deltaBlack = blackPawnsState - blackPawnsGame;
    let deltaWhite = whitePawnsGame - whitePawnsState;

    return (state.turnColor == "b") ? deltaBlack : deltaWhite;
}

// return an higher number when there are more pawns on the border of the gameboard
function conquestBorderHeuristic(state) {
    let blackBorder = getPawnsBorder(state, "b");
    let whiteBorder = getPawnsBorder(state, "w");

    if (blackBorder + whiteBorder == 0) return 0;
    return 100 * (blackBorder - whiteBorder) / (blackBorder + whiteBorder);
}

function conquestCornerHeuristic(state) {
    let blackCorner = getPawnsCorner(state, "b");
    let whiteCorner = getPawnsCorner(state, "w");

    if (blackCorner + whiteCorner == 0) return 0;
    return 100 * (blackCorner - whiteCorner) / (blackCorner + whiteCorner);
}

// return an higher number if it's possible to make the opponent skip a turn
function skipOpponentTurnHeuristic(state) {
    let tmpState = structuredClone(state);
    tmpState.turn = state.turn == "b" ? "w" : "b";

    if (getPossibleMovesNumber(tmpState) == 0 && state.turn == "b") return 100;
    else if (getPossibleMovesNumber(tmpState) == 0 && state.turn == "w") return -100;
    else return 0;
}

function mobilityHeuristic(state) {
    let opponent = state.turn == "b" ? "w" : "b";
    let sign = state.turn == "b" ? 1 : -1;

    // actual mobility is the numner of possible moves in a state, calculated both for the player and the opponent
    let actualMobilityPlayer = getPossibleMovesNumber(state);
    let tmpState = structuredClone(state);
    tmpState.turn = opponent;
    let actualMobilityOpponent = getPossibleMovesNumber(tmpState);
    
    let actualMobility = 0;
    if (actualMobilityPlayer + actualMobilityOpponent != 0){
        actualMobility = 100 * sign * (actualMobilityPlayer - actualMobilityOpponent) / (actualMobilityPlayer + actualMobilityOpponent);
    }

    // potential mobility is the number of empty spaces next to an opponent's pawn
    let potentialMobilityPlayer = getPotentialMobility(state, opponent)
    let potentialMobilityOpponent = getPotentialMobility(state, state.turn);

    let potentialMobility = 0;
    if (potentialMobilityPlayer + potentialMobilityOpponent != 0) {
        potentialMobility = 100 * sign * (potentialMobilityPlayer - potentialMobilityOpponent) / (potentialMobilityPlayer + potentialMobilityOpponent);
    }

    return actualMobility + potentialMobility;
}

function safePawnsHeuristic(state) {
    let safeWeight = 1;
    let unsafeWeight = -1;
    // object that contains n° of safe, semi-safe and unsafe pawns
    let blackPawnsStats = getPawnsStats(state, "b");
    let whitePawnsStats = getPawnsStats(state, "w");

    let blackSafety = safeWeight * blackPawnsStats.safePawns + unsafeWeight * blackPawnsStats.unsafePawns;
    let whiteSafety = safeWeight * whitePawnsStats.safePawns + unsafeWeight * whitePawnsStats.unsafePawns;

    if (blackSafety + whiteSafety == 0) return 0;
    return 100 * (blackSafety - whiteSafety) / (blackSafety + whiteSafety);
}

// complete basic heuristic
function basicHeuristic(state) {
    let result = 0;

    result += morePawnsHeuristic(state);

    result += eatingHeuristic(state);

    result += conquestBorderHeuristic(state);

    result += conquestCornerHeuristic(state);

    result += skipOpponentTurnHeuristic(state);

    result += mobilityHeuristic(state);

    result += safePawnsHeuristic(state);
    
    return result;
}

// weighted heuristic
function weightedHeuristic(state) {
    let result = 0;
    let weight = 0;

    weight = 0.4;
    result += weight * morePawnsHeuristic(state);

    weight = 0.3;
    result += weight * eatingHeuristic(state);

    weight = 0.8;
    result += weight * conquestBorderHeuristic(state);

    weight = 4;
    result += weight * conquestCornerHeuristic(state);

    weight = 1;
    result += weight * skipOpponentTurnHeuristic(state);

    weight = 1.2;
    result += weight * mobilityHeuristic(state);

    weight = 1.5;
    result += weight * safePawnsHeuristic(state);

    return result;
}

function iterativeDeepeningAlphaBeta(state, evaluationFunc) {
    // start time in seconds
    let startTime = new Date().getTime() / 1000;
    // console.log(startTime);

    function alphaBetaSearch(state, alpha, beta, depth) {
        function maxValue(state, alpha, beta, depth) {
            let value = -Infinity;
            for(let successor of getSuccessors(state)) {
                value = Math.max(value, alphaBetaSearch(successor, alpha, beta, depth - 1));
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
        
        // return (state.turn == "b") ? maxValue(state, alpha, beta, depth) : minValue(state, alpha, beta, depth);
        if (state.turn == "b") {
            return maxValue(state, alpha, beta, depth);
        } else {
            return minValue(state, alpha, beta, depth);
        }
    }

    let bestMove = null;

    for(let depth = 1; depth <= MAX_DEPTH; depth++) {
        console.log("depth: " + depth);
        // console.log(new Date().getTime() / 1000 - startTime);
        if ((new Date().getTime() / 1000) - startTime > MAX_ALLOWED_SECONDS) {
            break;
        }

        let val = (state.turn == "b") ? -Infinity : Infinity;
        
        for(let successor of getSuccessors(state)) {
            let score = alphaBetaSearch(successor, -Infinity, Infinity, depth);
            // console.log(score);
            if (state.turn == "b" && score >= val) {
                val = score;
                bestMove = successor.move;
            } else if (state.turn == "w" && score <= val) {
                val = score;
                bestMove = successor.move;
            }
        }
    }

    console.log(bestMove);
    return bestMove;
}
