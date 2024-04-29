class Node {
    constructor() {
        this.chosenMove = null;
        this.state = {
            turn: null,         // color of next turn
            gameBoard: null
        }
        this.possibleMoves = [];
        this.parent = null;
        this.children = [];
        this.depth = 0;
        this.value = 0;
    }

    addChild(child) {
        this.children.push(child);
        child.parent = node;
    }

    expand() {
        if (this.possibleMoves.length == 0) return;
        
        for(let move of this.possibleMoves) {
            childNode = new Node();
            childNode.chosenMove = move;
            childNode.possibleMoves = 
            childNode.depth = this.depth + 1;
            this.addChild(child);
        }
    }
}

function iterativeDeepeningAlphaBeta(state, evaluationFunc) {
    // start time in seconds
    let startTime = new Date().getTime() / 1000;

    let bestMove = null;
    for(const depth of Array(MAX_DEPTH).keys()) {
        if (Date().getTime / 1000 > MAX_ALLOWED_SECONDS) {
            break;
        }

        val = -Infinity;

        
    }
}