let locations = [];
let currentLocation = null;
let timerInterval;
let timeLeft = 300; // 5 minutes
let score = 100;
let revealedHint = "";

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

    // Randomly select street, postcode, or W3W
    let options = ["street", "postcode", "w3w"];
    revealedHint = options[Math.floor(Math.random() * options.length)];

    if (revealedHint === "street") {
        document.getElementById("clue").innerText = currentLocation.street;
    } else if (revealedHint === "postcode") {
        document.getElementById("clue").innerText = currentLocation.postcode;
    } else {
        // Ensure only the three words are shown (remove extra address info)
        let w3wParts = currentLocation.w3w.split(","); // Assuming W3W might be stored as "word1.word2.word3, City, Country"
        document.getElementById("clue").innerText = w3wParts[0]; 
    }

    startTimer();
}

function revealStreet() {
    if (!currentLocation) return;

    document.getElementById("street").innerText = currentLocation.street;
    document.getElementById("fullLocation").style.display = "block";

    if (revealedHint !== "street") {
        score -= 10;
        updateScore();
    }
}

function revealPostcode() {
    if (!currentLocation) return;

    document.getElementById("postcode").innerText = currentLocation.postcode;
    document.getElementById("fullLocation").style.display = "block";

    if (revealedHint !== "postcode") {
        score -= 10;
        updateScore();
    }
}

function revealW3W() {
    if (!currentLocation) return;

    let w3wParts = currentLocation.w3w.split(","); // Fixing incorrect W3W display
    let w3wThreeWords = w3wParts[0]; 

    document.getElementById("w3w").innerText = w3wThreeWords;
    document.getElementById("w3wLink").href = `https://what3words.com/${w3wThreeWords}`;
    document.getElementById("fullLocation").style.display = "block";

    if (revealedHint !== "w3w") {
        score -= 10;
        updateScore();
    }
}

function finishGame() {
    if (!currentLocation) return;

    document.getElementById("mapsLink").href = currentLocation.maps_url;
    document.getElementById("mapsLink").innerText = "View on Google Maps";

    // **Fix Google Maps Screenshot**
    document.getElementById("locationMap").src = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.latitude},${currentLocation.longitude}&zoom=16&size=400x400&markers=color:red%7C${currentLocation.latitude},${currentLocation.longitude}&key=YOUR_API_KEY`;
    document.getElementById("fullLocation").style.display = "block";

    clearInterval(timerInterval);
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 300;
    document.getElementById("timer").innerText = "5:00";

    timerInterval = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! You must finish now.");
            finishGame();
        }
    }, 1000);
}

function updateScore() {
    document.getElementById("score").innerText = score;
}
