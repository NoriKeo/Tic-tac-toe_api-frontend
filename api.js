
document.addEventListener("DOMContentLoaded", function () {
    //document.getElementById("login").addEventListener("click", login);
    //document.getElementById("creat").addEventListener("click", creat); 
    document.getElementById("creatAccount").addEventListener("click", creatAccount);
    document.getElementById("loginpage").addEventListener("click", loginpage)
    document.getElementById("newPasswort").addEventListener("click", newPasswort);
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
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        handleErrorMessages("Server error","no response from server")
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

