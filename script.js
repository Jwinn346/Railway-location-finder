let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes
let score = 100;
let clueType = "";

document.addEventListener("DOMContentLoaded", () => {
    fetch("test_streets.json")
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
    document.getElementById("street").innerText = ""; 
    document.getElementById("postcode").innerText = ""; 
    document.getElementById("mapsLink").style.display = "none"; 
    document.getElementById("locationMap").style.display = "none"; 
    document.getElementById("score").innerText = "100";
    score = 100;

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

    let mapsURL = currentLocation.maps_url;
    document.getElementById("mapsLink").href = mapsURL;
    document.getElementById("mapsLink").innerText = "View on Google Maps";
    document.getElementById("mapsLink").style.display = "block"; 
    document.getElementById("fullLocation").style.display = "block";

    // ✅ Generate Google Maps screenshot without API Key
    let encodedLocation = encodeURIComponent(currentLocation.street + ", " + currentLocation.postcode);
    let mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=16&size=600x300&markers=color:red%7C${encodedLocation}`;
    
    document.getElementById("locationMap").src = mapImageUrl;
    document.getElementById("locationMap").style.display = "block"; 

    clearInterval(timerInterval);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 300; 
    updateTimerDisplay(); 

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! You must finish now.");
            finishGame();
            return;
        }

        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds} minutes`;
}

function updateScore() {
    document.getElementById("score").innerText = score;
}
