function new_game(n) {
    board = "<table id='board'>"

    for(i=0; i < n; i++) {
        board += "<tr>"
        for(j=0; j < n; j++) {
            board += "<td id='cell-" + i + "-" + j + "'>"+ i + j + "</td>"
        }
        board += "</tr>"
    }

    board += "</table>"
    document.getElementById("board-container").innerHTML = board
}