
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("creat").addEventListener("click", creat); 
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("creatAccount").addEventListener("click", creatAccount);
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).addEventListener("click", function () {
            match(i); 
            console.log('Geklickte ID:', id);
        });
    }
    console.log("LocalStorage nach Laden der Seite:", localStorage.getItem("playerId"));
});


function login() {
    const playerName = document.getElementById('playerName').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, password })
    })
        .then(response => response.json())
        .then(data => {
            if (typeof data.playerId === "number") {
                console.log('Login erfolgreich! Player ID:', data.playerId);
                localStorage.setItem('playerId', data.playerId.toString());
                window.location.href = 'game.html';
            } else {
                alert('Login fehlgeschlagen! Ungültige Antwort vom Server.');
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Es gab ein Problem mit der Anmeldung.');
        });
}

function creat() {
    window.location.href = 'creatAccount.html';
}
function newGame() {
    window.location.href = 'game.html';
}

function creatAccount(){
    const playerName = document.getElementById('playerName').value;
    const password = document.getElementById('password').value;
    const securityAnswer = document.getElementById('securityAnswer').value;

    fetch('http://localhost:8000/api/creataccount',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, password, securityAnswer})
    })
    .then(response => response.json())
        .then(data => {
            if (typeof data.playerId === "number") {
                console.log('Account erstellen erfolgreich! Player ID:', data.playerId);
                localStorage.setItem('playerId', data.playerId.toString());

                console.log(localStorage.getItem('playerId'));
                window.location.href = 'game.html';

            
            } else {
                alert('Account erstellen fehlgeschlagen! Ungültige Antwort vom Server.');
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Es gab ein Problem mit der Account erstellung.');
        });

}


function match(clicked_id) {
    console.log("LocalStorage direkt nach Laden der Seite:", localStorage.getItem("playerId"));
    const playerId = localStorage.getItem('playerId');


    if (!playerId) {
        alert("Es ist ein Fehler aufgetreten. Die playerId ist nicht verfügbar.");
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
}

let computerPlays = data.computerPlays;
if (computerPlays && computerPlays.length > 0) {
    computerPlays.forEach(id => {
        let button = document.getElementById(id);
        if (button) {
            button.style.backgroundImage = "url('img/computer2.0.png')";
            button.style.backgroundSize = "cover";
            button.style.backgroundPosition = "center";
            console.log("Computerfeld gefärbt:", id);
        }
    });
}

alert("win");
if (data.winner > 0) {
    localStorage.setItem('win', data.winner);
    //localStorage.setItem('score', data.score);

    const winner = localStorage.getItem('win');
    //const score = JSON.parse(localStorage.getItem('score'));
    alert(data.score)
    //document.getElementById('scoreDisplay').textContent = data.score ? data.score.join(" - ") : "Kein Score verfügbar";
    document.getElementById('scoreDisplay').textContent = data.score 
    ? `Player:  ${data.score[0]} | Computer: ${data.score[1]} | draw: ${data.score[2]}`
    : "Kein Score verfügbar";


    let message = "Unbekanntes Ergebnis";
    if (winner == 1) {
        message = "Glückwunsch! Du hast gewonnen!";
    } else if (winner == 2) {
        message = "Leider verloren! Der Computer hat gewonnen.";
    } else if (winner == 3) {
        message = "Es ist ein Unentschieden!";
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

    document.getElementById('resultContainer').style.display = 'block'; // Sichtbar machen
} else {
    console.log('Kein Ergebnis gefunden.');
}


const playerButton = document.getElementById(data.move);
const computerButton = document.getElementById(data.computerMove);

alert(`Letzter Spielzug: Spieler  ${data.move}, Computer  ${data.computerMove}`);

if (playerButton) {
    playerButton.style.backgroundImage = "url('./img/player.png')";
    playerButton.style.backgroundSize = "cover";
    playerButton.style.backgroundPosition = "center";
    
}

if (computerButton) {
    computerButton.style.backgroundImage = "url('img/computer2.0.png')";
    computerButton.style.backgroundSize = "cover";
    computerButton.style.backgroundPosition = "center";
}

    })
    .catch(error => {
        console.error('Fehler bei der Anfrage:', error);
    });
}


function showresult() {



}

