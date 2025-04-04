window.matchHistoryData = null;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("matchHistory").addEventListener("click", matchHistoryload);
    document.getElementById("load").addEventListener("click", load);
    document.getElementById("resetFilter").addEventListener("click", resetFilter);

    const playerId = localStorage.getItem('playerId');
    console.log("LocalStorage nach Laden der Seite:", playerId);

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
        window.matchHistoryData = data;
        console.log("MatchHistory erfolgreich geladen:", data);
    })
    .catch(error => console.error("Fehler beim Laden der Match-Historie:", error));
});

function load() {
    const data = window.matchHistoryData;
    if (!data) {
        handleErrorMessages("Datenfehler", "Match-Daten noch nicht geladen");
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
}

function filterMatches() {
    const data = window.matchHistoryData;
    if (!data) {
        handleErrorMessages("Datenfehler", "Match-Daten noch nicht geladen");
        return;
    }

    let startdata = document.getElementById("dateFilter").value;
    let enddata = document.getElementById("dateFilter2").value;
    let result = document.querySelector('input[name="result"]:checked')?.value;

    if (!Array.isArray(data) || data.length === 0) {
        console.log("Keine Match-Daten vorhanden.");
        return;
    }

    const filteredDataStart = startdata ? data.filter(entry => entry.started_at.startsWith(startdata)) : data;
    const filteredDataEnd = enddata ? data.filter(entry => entry.ended_at.startsWith(enddata)) : data;
    const filteredDataResult = result ? data.filter(entry => entry.verdict_id === Number(result)) : data;

    const commonEntries = filteredDataStart.filter(entry =>
        filteredDataEnd.some(e => e.id === entry.id) &&
        filteredDataResult.some(e => e.id === entry.id)
    );

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

    commonEntries.forEach((match, index) => {
        updateBoard(`.board${index}`, match.playerMoves, match.computerMoves);
    });

    filterMessages("Filter", "Filter erfolgreich angewendet");
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
