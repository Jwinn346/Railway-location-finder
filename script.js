let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes (in seconds)
let score = 100;
let clueType = "";

document.addEventListener("DOMContentLoaded", () => {
    fetch("railway_addresses_cleaned.json")
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

    // Randomly pick whether to show part of the street or the postcode first
    clueType = Math.random() < 0.5 ? "street" : "postcode";
    let clueText = "";

    if (clueType === "street") {
        let streetParts = currentLocation.street.split(" ");
        clueText = streetParts.length > 1 ? streetParts[0] + "..." : "Unknown Street";
    } else {
        let postcodeParts = currentLocation.postcode.split(" ");
        clueText = postcodeParts.length > 1 ? postcodeParts[0] + "..." : "Unknown Postcode";
    }

    document.getElementById("clue").innerText = clueText;

    // Start the timer
    startTimer();
}

function revealStreet() {
    if (!currentLocation) return;

    document.getElementById("street").innerText = currentLocation.street;
    document.getElementById("fullLocation").style.display = "block";

    if (clueType !== "street") {
        score -= 10;
        updateScore();
    }
}

function revealPostcode() {
    if (!currentLocation) return;

    document.getElementById("postcode").innerText = currentLocation.postcode;
    document.getElementById("fullLocation").style.display = "block";

    if (clueType !== "postcode") {
        score -= 10;
        updateScore();
    }
}

function finishGame() {
    if (!currentLocation) return;

    document.getElementById("mapsLink").href = currentLocation.maps_url;
    document.getElementById("mapsLink").innerText = "View on Google Maps";
    document.getElementById("fullLocation").style.display = "block";

    // Fetch and display the map screenshot without an API key
    let lat = currentLocation.latitude;
    let lon = currentLocation.longitude;
    let mapImageUrl = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;

    // Embed Google Maps without API key
    let mapIframe = `<iframe width="400" height="400" src="${mapImageUrl}" frameborder="0" allowfullscreen></iframe>`;
    document.getElementById("mapContainer").innerHTML = mapIframe;
    document.getElementById("mapContainer").style.display = "block";

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
