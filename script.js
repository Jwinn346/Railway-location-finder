let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes
let score = 100;
let revealedStreet = false;
let revealedPostcode = false;

document.addEventListener("DOMContentLoaded", () => {
    fetch("railway_addresses_109.json")
        .then(response => response.json())
        .then(data => {
            locations = data;
        });

    document.getElementById("generateLocation").addEventListener("click", generateLocation);
    document.getElementById("revealStreet").addEventListener("click", revealStreet);
    document.getElementById("revealPostcode").addEventListener("click", revealPostcode);
    document.getElementById("finish").addEventListener("click", finishGame);
});

function generateLocation() {
    if (locations.length === 0) {
        alert("Locations are still loading, please wait.");
        return;
    }

    currentLocation = locations[Math.floor(Math.random() * locations.length)];
    document.getElementById("fullLocation").style.display = "none";
    document.getElementById("score").innerText = "100";
    score = 100;
    revealedStreet = false;
    revealedPostcode = false;

    // Randomly display either Street Name or Postcode
    let showStreet = Math.random() < 0.5;
    document.getElementById("initialHint").innerText = showStreet ? `Street: ${currentLocation.street}` : `Postcode: ${currentLocation.postcode.split(" ")[0]}...`;

    startTimer();
}

function revealStreet() {
    if (!currentLocation || revealedStreet) return;

    document.getElementById("street").innerText = currentLocation.street;
    revealedStreet = true;
    document.getElementById("fullLocation").style.display = "block";
    score -= 10;
    updateScore();
}

function revealPostcode() {
    if (!currentLocation || revealedPostcode) return;

    document.getElementById("postcode").innerText = currentLocation.postcode;
    revealedPostcode = true;
    document.getElementById("fullLocation").style.display = "block";
    score -= 10;
    updateScore();
}

function finishGame() {
    if (!currentLocation) return;

    document.getElementById("mapsLink").href = currentLocation.maps_url;
    document.getElementById("mapsLink").innerText = "View on Google Maps";
    document.getElementById("fullLocation").style.display = "block";

    // Static Map Screenshot from Yandex (No API Required)
    const staticMapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&size=450,300&z=17&ll=${currentLocation.longitude},${currentLocation.latitude}&l=map&pt=${currentLocation.longitude},${currentLocation.latitude},pm2rdm`;
    document.getElementById("mapImage").src = staticMapUrl;

    clearInterval(timerInterval);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 300;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! You must finish now.");
            finishGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function updateScore() {
    document.getElementById("score").innerText = score;
}
