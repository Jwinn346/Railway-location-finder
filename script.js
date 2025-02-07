let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes
let score = 100;
let clueType = "";
let googleMapsAPIKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual Google Maps API key

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
    document.getElementById("score").innerText = "100";
    score = 100;

    // Randomly pick whether to show part of the street or the postcode first
    clueType = Math.random() < 0.5 ? "street" : "postcode";
    let clueText = "";

    if (clueType === "street") {
        let streetParts = currentLocation.street.split(" ");
        clueText = streetParts.length > 1 ? streetParts[0] + "..." : currentLocation.street;
    } else {
        let postcodeParts = currentLocation.postcode.split(" ");
        clueText = postcodeParts.length > 1 ? postcodeParts[0] + "..." : currentLocation.postcode;
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

    // Stop timer
    clearInterval(timerInterval);

    // Show Google Maps Screenshot
    let mapsImage = document.createElement("img");
    mapsImage.src = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.maps_url.replace(
        "https://www.google.com/maps?q=",
        ""
    )}&zoom=15&size=600x400&maptype=roadmap&key=${googleMapsAPIKey}`;
    mapsImage.alt = "Location Map";
    mapsImage.style.marginTop = "20px";

    let mapContainer = document.getElementById("mapContainer");
    mapContainer.innerHTML = ""; // Clear previous image
    mapContainer.appendChild(mapsImage);
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
    document.getElementById("timer").innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function updateScore() {
    document.getElementById("score").innerText = score;
}
