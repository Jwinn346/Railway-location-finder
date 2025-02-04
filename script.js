document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateLocation");
    const revealBtns = document.querySelectorAll(".reveal-btn");
    const locationName = document.getElementById("locationName");
    const postcodeElement = document.querySelector("#postcode span");
    const streetElement = document.querySelector("#street span");
    const w3wElement = document.querySelector("#w3w span");
    const timerElement = document.getElementById("timer");
    const hintElement = document.getElementById("hint");
    const finishButton = document.getElementById("finishButton");
    const restartButton = document.getElementById("restartButton");
    const resultScreen = document.getElementById("resultScreen");
    const mainScreen = document.getElementById("mainScreen");

    const finalStreet = document.getElementById("finalStreet");
    const finalPostcode = document.getElementById("finalPostcode");
    const finalW3W = document.getElementById("finalW3W");
    const finalTime = document.getElementById("finalTime");
    const mapScreenshot = document.getElementById("mapScreenshot");

    let locations = [];
    let currentLocation = null;
    let timer;
    let timeLeft = 300;
    let elapsedTime = 0;

    // Fetch the JSON file
    fetch("filtered_postcodes.json")
        .then(response => response.json())
        .then(data => {
            locations = data;
        });

    function startTimer() {
        clearInterval(timer);
        timeLeft = 300;
        elapsedTime = 0;
        updateTimerDisplay();

        timer = setInterval(() => {
            timeLeft--;
            elapsedTime++;
            updateTimerDisplay();

            if (timeLeft === 180) {
                hintElement.classList.remove("hidden");
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                finishGame(); // Auto-finish when timer runs out
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `⏳ Timer: ${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function generateRandomLocation() {
        if (locations.length === 0) return;

        const randomIndex = Math.floor(Math.random() * locations.length);
        currentLocation = locations[randomIndex];

        locationName.textContent = `${currentLocation.street}, ${currentLocation.postcode}`;

        postcodeElement.textContent = "";
        streetElement.textContent = "";
        w3wElement.textContent = "";

        hintElement.classList.add("hidden");
        startTimer();
    }

    function revealInfo(type) {
        if (!currentLocation) return;

        if (type === "postcode") {
            postcodeElement.textContent = currentLocation.postcode;
        } else if (type === "street") {
            streetElement.textContent = currentLocation.street;
        } else if (type === "w3w") {
            w3wElement.textContent = "Example.Words.Here"; // Replace with actual What3Words
        }
    }

    function finishGame() {
        clearInterval(timer);

        // Show results
        finalStreet.textContent = currentLocation.street;
        finalPostcode.textContent = currentLocation.postcode;
        finalW3W.textContent = "Example.Words.Here"; // Replace with actual W3W

        // Show time taken
        const minutesTaken = Math.floor(elapsedTime / 60);
        const secondsTaken = elapsedTime % 60;
        finalTime.textContent = `${minutesTaken}:${secondsTaken.toString().padStart(2, "0")}`;

        // Set Google Maps screenshot (use Google Static Maps API)
        const mapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.lat},${currentLocation.lon}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${currentLocation.lat},${currentLocation.lon}&key=YOUR_GOOGLE_MAPS_API_KEY`;
        mapScreenshot.src = mapURL;

        // Hide main screen, show results
        mainScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
    }

    function restartGame() {
        resultScreen.classList.add("hidden");
        mainScreen.classList.remove("hidden");
        locationName.textContent = "Click the button to generate.";
        timerElement.textContent = "⏳ Timer: 5:00";
    }

    generateBtn.addEventListener("click", generateRandomLocation);
    revealBtns.forEach(button => {
        button.addEventListener("click", () => revealInfo(button.getAttribute("data-type")));
    });
    finishButton.addEventListener("click", finishGame);
    restartButton.addEventListener("click", restartGame);
});
