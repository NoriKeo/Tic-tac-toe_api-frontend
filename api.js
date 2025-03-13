
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login").addEventListener("click", login);
    document.getElementById("creat").addEventListener("click", creat); 
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

/* document.addEventListener("DOMContentLoaded", function () {
   
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i).addEventListener("click",match);
       
    }
    console.log("LocalStorage nach Laden der Seite:", localStorage.getItem("playerId"));
    
});
 */

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
       

        /* const message = data.message;  
        const matchId = data.matchID;
        const score = data.score; */

        if(data.winner > 0){
            window.location.href = 'win.html';
        }

        const playerButton = document.getElementById(data.move);
        const computerButton = document.getElementById(data.computerMove);

        alert(move,computerMove)
        if (playerButton) {
            playerButton.style.backgroundColor = 'Aquamarine'; 
        }

        if (computerButton) {
            computerButton.style.backgroundColor = 'CornflowerBlue';  
        }
    })
    .catch(error => {
        console.error('Fehler bei der Anfrage:', error);
    });
}


