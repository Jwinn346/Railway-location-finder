let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes
let score = 100;
let hintType = "";

document.addEventListener("DOMContentLoaded", () => {
    fetch("railway_addresses_cleaned.json")
        .then(response => response.json())
        .then(data => {
            locations = data;
        });

    document.getElementById("generateLocation").addEventListener("click", generateLocation);
    document.getElementById("revealStreet").addEventListener("click", revealStreet);
    document.getElementById("revealPostcode").addEventListener("click", revealPostcode);
    document.getElementById("revealW3W").addEventListener("click", revealW3W);
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

    // Randomly show one of the three (Street, Postcode, or W3W)
    let options = ["street", "postcode", "w3w"];
    hintType = options[Math.floor(Math.random() * options.length)];
    
    let hintText = "";
    if (hintType === "street") {
        hintText = currentLocation.street;
    } else if (hintType === "postcode") {
        hintText = currentLocation.postcode;
    } else if (hintType === "w3w") {
        hintText = currentLocation.w3w;
    }

    document.getElementById("hint").innerText = hintText;

    // Start the timer
    startTimer();
}

function revealStreet() {
    if (!currentLocation) return;
    document.getElementById("street").innerText = currentLocation.street;
    document.getElementById("fullLocation").style.display = "block";

    if (hintType !== "street") {
        score -= 10;
        updateScore();
    }
}

function revealPostcode() {
    if (!currentLocation) return;
    document.getElementById("postcode").innerText = currentLocation.postcode;
    document.getElementById("fullLocation").style.display = "block";

    if (hintType !== "postcode") {
        score -= 10;
        updateScore();
    }
}

function revealW3W() {
    if (!currentLocation) return;
    let w3wText = currentLocation.w3w;
    let w3wLink = `https://what3words.com/${w3wText.replace(/\./g, '')}`;

    document.getElementById("w3w").innerText = w3wText;
    document.getElementById("w3wLink").href = w3wLink;
    document.getElementById("w3wLink").style.display = "inline";
    document.getElementById("fullLocation").style.display = "block";

    if (hintType !== "w3w") {
        score -= 10;
        updateScore();
    }
}

function finishGame() {
    if (!currentLocation) return;

    document.getElementById("mapsLink").href = currentLocation.maps_url;
    document.getElementById("mapsLink").innerText = "View on Google Maps";
    document.getElementById("fullLocation").style.display = "block";

    let lat = currentLocation.latitude;
    let lon = currentLocation.longitude;
    let mapImageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=15&size=600x400&markers=color:red%7C${lat},${lon}`;

    document.getElementById("mapScreenshot").src = mapImageURL;
    document.getElementById("mapScreenshot").style.display = "block";

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
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateScore() {
    document.getElementById("score").innerText = score;
}
