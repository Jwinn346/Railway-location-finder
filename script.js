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
    document.getElementById("mapContainer").style.display = "none";
    document.getElementById("score").innerText = "100";
    score = 100;

    // Randomly pick whether to show part of the street or postcode first
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

    // Use Google Maps Screenshot without API Key
    const mapsScreenshotUrl = `https://maps.google.com/maps?q=${encodeURIComponent(currentLocation.street + ", " + currentLocation.postcode)}&output=embed`;

    document.getElementById("mapContainer").innerHTML = `<iframe width="600" height="400" src="${mapsScreenshotUrl}" frameborder="0" style="border:0" allowfullscreen></iframe>`;
    document.getElementById("mapContainer").style.display = "block";

    clearInterval(timerInterval);
}
