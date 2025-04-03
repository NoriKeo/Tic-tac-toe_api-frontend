document.addEventListener("DOMContentLoaded", function () {
   
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("matchHistory").addEventListener("click", matchHistoryload);
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).addEventListener("click", function () {
            match(i); 
            console.log('Geklickte ID:', id);
        });
    }
    console.log("LocalStorage nach Laden der Seite:", localStorage.getItem("playerId"));
});





function match(clicked_id) {
    console.log("LocalStorage direkt nach Laden der Seite:", localStorage.getItem("playerId"));
    const playerId = localStorage.getItem('playerId');


    if (!playerId) {
        handleErrorMessages("data problem","no playerid available");

        //alert("Es ist ein Fehler aufgetreten. Die playerId ist nicht verfügbar.");
        return;
    }
    const move = parseInt(clicked_id); 
    console.log('Geklickte ID:', clicked_id);
    fetch('http://localhost:8000/api/matchHandler', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            
        },
        body: JSON.stringify({"playerId": playerId, "move": move })

    })
    .then(response => response.json())

    .then(data => {
        

        console.log("Server-Antwort:", data);

let playerPosition = data.playerPosition;
if (playerPosition && playerPosition.length > 0) {
    playerPosition.forEach(id => {
        let button = document.getElementById(id);
        if (button) {
            button.style.backgroundImage = "url('./img/player.png')";
            button.style.backgroundSize = "cover";
            button.style.backgroundPosition = "center";
            console.log("Spielerfeld gefärbt:", id);
        }
    });
} else{
    handleErrorMessages("incorrect entry","select a free field");
}

let computerPlays = data.computerPlays;


alert(computerPlays);
    
if(computerPlays.length != 0 ) {
    computerPlays.forEach(id => {
        let button = document.getElementById(id);
        if (button) {
            button.style.backgroundImage = "url('img/computer2.0.png')";
            button.style.backgroundSize = "cover";
            button.style.backgroundPosition = "center";
            console.log("Computerfeld gefärbt:", id);
        }
    });
}else{
    handleErrorMessages("Server error", "no computer response");
    alert("computer problem");
}

if (data.winner > 0) {
    localStorage.setItem('win', data.winner);
    //localStorage.setItem('score', data.score);
    //alert("win");
    const winner = localStorage.getItem('win');
    //const score = JSON.parse(localStorage.getItem('score'));
    //document.getElementById('scoreDisplay').textContent = data.score ? data.score.join(" - ") : "Kein Score verfügbar";
    document.getElementById('scoreDisplay').textContent = data.score 
    ? `Player:  ${data.score[0]} | Computer: ${data.score[1]} | draw: ${data.score[2]}`
    : "Kein Score verfügbar";


    let message = "Unbekanntes Ergebnis";
    if (winner == 1) {
        message = "You won!";
    } else if (winner == 2) {
        message = "You lost";
    } else if (winner == 3) {
        message = "draw";
    }

    document.getElementById('resultMessage').textContent = message;

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'new Game';
    newGameButton.onclick = function() {
        location.reload();
    };

    document.getElementById('resultContainer').appendChild(newGameButton);

    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.disabled = true; 
    });
    document.getElementById('resultContainer').style.fontFamily =  'Sour Gummy, sans-serif';

    document.getElementById('resultContainer').style.display = 'block'; 
    document.getElementById('title').style.display = 'none';

} 


    })
    .catch(error => {
        handleErrorMessages("server error","no response from server" );
        console.error('Fehler bei der Anfrage:', error);
    });
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
