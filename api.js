
document.addEventListener("DOMContentLoaded", function () {
    //document.getElementById("login").addEventListener("click", login);
    //document.getElementById("creat").addEventListener("click", creat); 
    document.getElementById("newGame").addEventListener("click", newGame);
    document.getElementById("creatAccount").addEventListener("click", creatAccount);
    document.getElementById("loginpage").addEventListener("click", loginpage)
    document.getElementById("matchHistory").addEventListener("click", matchHistoryload);
    document.getElementById("load").addEventListener("click", load);
    //document.getElementById("newPasswort").addEventListener("click", newPasswort);
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).addEventListener("click", function () {
            match(i); 
            console.log('Geklickte ID:', id);
        });
    }
    console.log("LocalStorage nach Laden der Seite:", localStorage.getItem("playerId"));
});

function loginpage(){
    window.location.href = 'init.html';
}
function matchHistoryload(){

    window.location.href = 'matchHistory.html';
    
    
}

function login() {
    //alert("hallo");
    const playerName = document.getElementById('playerName').value;
    const password = document.getElementById('password').value;
    document.getElementById("error-message").style.display = "none"; 
    document.getElementById("server-error").style.display = "none";
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
                
                handleErrorMessages("login error","Username or password is incorrect.")
                //document.getElementById("error-message").style.display = "block";

                //alert('Login fehlgeschlagen! Ungültige Antwort vom Server.');
            }
        })
        .catch(error => {
            
            handleErrorMessages("server error","no response from server")
            console.error('Fehler:', error);
            //document.getElementById("server-error").style.display = "block";

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
                 
                 handleErrorMessages("login error", "Failed to create an account!");
                //alert('Account erstellen fehlgeschlagen! Ungültige Antwort vom Server.');
            }
        })
        .catch(error => {
             handleErrorMessages("Server errror","no response from server");
            console.error('Fehler:', error);
            //alert('Es gab ein Problem mit der Account erstellung.');
        });

}


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

    document.getElementById('resultContainer').style.display = 'block'; // Sichtbar machen
} 


/*const playerButton = document.getElementById(data.move);
const computerButton = document.getElementById(data.computerMove);


if (playerButton) {
    playerButton.style.backgroundImage = "url('./img/player.png')";
    playerButton.style.backgroundSize = "cover";
    playerButton.style.backgroundPosition = "center";
    
}

if (computerButton) {
    computerButton.style.backgroundImage = "url('img/computer2.0.png')";
    computerButton.style.backgroundSize = "cover";
    computerButton.style.backgroundPosition = "center";
} */

    })
    .catch(error => {
        handleErrorMessages("server error","no response from server" );
        console.error('Fehler bei der Anfrage:', error);
    });
}


function load(){
    console.log("LocalStorage direkt nach Laden der Seite:", localStorage.getItem("playerId"));
    const playerId = localStorage.getItem('playerId');


    if (!playerId) {
        handleErrorMessages("data problem","no playerid available");
        //("Es ist ein Fehler aufgetreten. Die playerId ist nicht verfügbar.");
        return;
    }
    
    fetch('http://localhost:8000/api/matchHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            
        },
        body: JSON.stringify({"playerId": playerId})

    })
    .then(response => response.json())

    .then(data => {

        

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
        
        
        for (let i = 0; i <= 10; i++) {
            updateBoard(`.board${i}`, data[`playerMoves${i + 1}`], data[`computerMoves${i + 1}`]);
        }
        
        
        
        

        
    

    });


}

function setLocalStorageWithExpiry(key, value, expiryInSeconds) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + expiryInSeconds * 1000, 
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function checkLocalStorageExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        window.location.href = "init.html";
    }
}

setLocalStorageWithExpiry("sessionData", "your_value", 7200000);

window.onload = function() {
    checkLocalStorageExpiry("sessionData");
};


setInterval(() => {
    checkLocalStorageExpiry("sessionData");
}, 10000); 

function newPasswort(){
    const playerName = document.getElementById('playerName').value;
    const password = document.getElementById('password').value;
    const securityAnswer = document.getElementById('securityAnswer').value;

    fetch('http://localhost:8000/api/newPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName, password, securityAnswer })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.playerId) {
            console.log('Passwort erfolgreich geändert! Player ID:', data.playerId);
            localStorage.setItem('playerId', data.playerId.toString());
            window.location.href = 'game.html';
        } else {
            handleErrorMessages("Login error","Wrong answer or username.")
            //alert('Passwortänderung fehlgeschlagen! Falsche Sicherheitsantwort oder Benutzername.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        handleErrorMessages("Server error","no response from server")
        //('Es gab ein Problem mit der Passwortänderung.');
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