document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("matchHistory").addEventListener("click", matchHistoryload);
    document.getElementById("load").addEventListener("click", load);
    document.getElementById("resetFilter").addEventListener("click",resetFilter);
    console.log("LocalStorage nach Laden der Seite:", localStorage.getItem("playerId"));
});



function load() {
    console.log("LocalStorage direkt nach Laden der Seite:", localStorage.getItem("playerId"));
    const playerId = localStorage.getItem('playerId');

    if (!playerId) {
        handleErrorMessages("data problem", "no playerid available");
        return;
    }
    
    fetch('http://localhost:8000/api/matchHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "playerId": playerId })
    })
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
            console.log("Keine Match-Daten vorhanden.");
            return;
        }
        
        const randomMatches = data.sort(() => 0.5 - Math.random()).slice(0, 12);

        const updateBoard = (boardClass, playerMoves, computerMoves) => {
            const board = document.querySelector(boardClass);
            if (!board) return;
    
            playerMoves.forEach(id => {
                const button = board.querySelector(`button[id='${id}']`);
                if (button) {
                    button.style.backgroundImage = "url('./img/player.png')";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.disabled = true;
                }
            });
    
            computerMoves.forEach(id => {
                const button = board.querySelector(`button[id='${id}']`);
                if (button) {
                    button.style.backgroundImage = "url('img/computer2.0.png')";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.disabled = true;
                }
            });
        };
    
        randomMatches.forEach((match, index) => {
            updateBoard(`.board${index}`, match.playerMoves, match.computerMoves);
        });
    })
    .catch(error => console.error("Fehler beim Laden der Match-Historie:", error));
}

 function filterMatches() {
    console.log("LocalStorage direkt nach Laden der Seite:", localStorage.getItem("playerId"));
    const playerId = localStorage.getItem('playerId');

    if (!playerId) {
        handleErrorMessages("data problem", "no playerid available");
        return;
    }
    
    fetch('http://localhost:8000/api/matchHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "playerId": playerId })
    })
    .then(response => response.json())
    .then(data => {

    
        
        let startdata = document.getElementById("dateFilter").value;
        let enddata = document.getElementById("dateFilter2").value;
        let result = document.querySelector('input[name="result"]:checked')?.value;

if (!Array.isArray(data) || data.length === 0) {
    console.log("Keine Match-Daten vorhanden.");
    return;
}

console.log(result);
console.log(startdata)
const filteredDataStart = data.filter(entry => entry.started_at.startsWith(startdata));
const filteredDataEnd = data.filter(entry => entry.ended_at.startsWith(enddata));
const filteredDataResult = data.filter(entry => entry.verdict_id === Number(result));

const commonEntries = filteredDataStart.filter(entry =>
    filteredDataEnd.some(e => e.id === entry.id) &&
    filteredDataResult.some(e => e.id === entry.id)
);

console.log("commonEntries ",commonEntries);

console.log("start ",filteredDataStart);
console.log("end ",filteredDataEnd);
console.log(" result ",filteredDataResult);

    
        const updateBoard = (boardClass, playerMoves, computerMoves) => {
            console.log("problem2.1");

            const board = document.querySelector(boardClass);
            if (!board) return;
            console.log("problem2.1");

            playerMoves.forEach(id => {
                const button = board.querySelector(`button[id='${id}']`);
                if (button) {
                    button.style.backgroundImage = "url('./img/player.png')";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.disabled = true;
                }
            });
    
            computerMoves.forEach(id => {
                const button = board.querySelector(`button[id='${id}']`);
                if (button) {
                    button.style.backgroundImage = "url('img/computer2.0.png')";
                    button.style.backgroundSize = "cover";
                    button.style.backgroundPosition = "center";
                    button.disabled = true;
                }
            });
        };
       
        commonEntries.forEach((match, index) => {

            updateBoard(`.board${index}`, match.playerMoves, match.computerMoves);
        }); 
        filterMessages("works","Filter worked");

        
        
    })
    .catch(error => console.error("Fehler beim filter der Match-Historie:", error));
    
 }

 function createTicTacToeBoards(numBoards) {
    const container = document.getElementById("gameContainer");
    for (let i = 0; i < numBoards; i++) {
        let board = document.createElement("div");
        board.classList.add("board" + i);
        for (let j = 0; j < 9; j++) {
            let button = document.createElement("button");
            button.classList.add("button");
            button.id = `${j + 1}`;
            button.setAttribute("onclick", "match(this.id)");
            board.appendChild(button);
        }
        container.appendChild(board);
    }
}
           

window.resetFilter = function() {
    document.getElementById("dateFilter").value = "";
    document.getElementById("dateFilter2").value = "";
    let selectedRadio = document.querySelector('input[name="result"]:checked');
    if (selectedRadio) {
        selectedRadio.checked = false;
    }
    console.log("Filter zurückgesetzt");    
    filterMessages("resetFilter","filter has been reset ");
};


function filterMessages(errorType, message) {
    let errorContainer = document.getElementById("error-container");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "error-container";
        errorContainer.style.position = "fixed";
        errorContainer.style.top = "10px";
        errorContainer.style.right = "10px";
        errorContainer.style.backgroundColor = "rgba(65, 255, 141, 0.8)";
        errorContainer.style.color = "white";
        errorContainer.style.padding = "10px";
        errorContainer.style.borderRadius = "5px";
        errorContainer.style.zIndex = "1000";
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `<strong>${errorType}:</strong> ${message}`;
    errorContainer.style.display = "block";
    
    setTimeout(() => {
        errorContainer.style.display = "none";
    }, 5000);
}

function handleErrorMessages(errorType, message) {
    let errorContainer = document.getElementById("error-container");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "error-container";
        errorContainer.style.position = "fixed";
        errorContainer.style.top = "10px";
        errorContainer.style.right = "10px";
        errorContainer.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        errorContainer.style.color = "white";
        errorContainer.style.padding = "10px";
        errorContainer.style.borderRadius = "5px";
        errorContainer.style.zIndex = "1000";
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `<strong>${errorType}:</strong> ${message}`;
    errorContainer.style.display = "block";
    
    setTimeout(() => {
        errorContainer.style.display = "none";
    }, 5000);
}
function newGame() {
    window.location.href = 'game.html';
}
