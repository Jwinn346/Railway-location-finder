document.addEventListener("DOMContentLoaded", () => {
    const locationDisplay = document.getElementById("generated-location");
    const locationType = document.getElementById("location-type");
    const generateButton = document.getElementById("generate-location");
    const revealPostcodeButton = document.getElementById("reveal-postcode");
    const revealStreetButton = document.getElementById("reveal-street");
    const revealWhat3WordsButton = document.getElementById("reveal-what3words");
    const finishButton = document.getElementById("finish");
    const timerDisplay = document.getElementById("timer");
    const pointsDisplay = document.getElementById("points");

    let timer, secondsElapsed = 0, points = 0;
    let currentLocation = {};

    // Load GeoJSON files
    async function loadLocationData() {
        try {
            const railwayData = await fetch("docs/railways-london.geojson").then(res => res.json());
            const streetData = await fetch("docs/streets-london-part-aa.geojson").then(res => res.json());
            return [...railwayData.features, ...streetData.features];
        } catch (error) {
            console.error("❌ Error loading location data:", error);
            locationDisplay.textContent = "Error loading location data.";
            return [];
        }
    }

    async function generateLocation() {
        const locations = await loadLocationData();
        if (!locations.length) {
            locationDisplay.textContent = "No locations available.";
            return;
        }

        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        currentLocation = {
            type: randomLocation.properties.type || "Unknown",
            postcode: randomLocation.properties.postcode || "N/A",
            street: randomLocation.properties.street || "N/A",
            what3words: randomLocation.properties.what3words || "N/A"
        };

        locationType.textContent = currentLocation.type;
        locationDisplay.textContent = "Location generated!";
        revealPostcodeButton.classList.remove("hidden");
        revealStreetButton.classList.remove("hidden");
        revealWhat3WordsButton.classList.remove("hidden");

        startTimer();
    }

    function startTimer() {
        clearInterval(timer);
        secondsElapsed = 0;
        timer = setInterval(() => {
            secondsElapsed++;
            timerDisplay.textContent = `00:${secondsElapsed < 10 ? "0" : ""}${secondsElapsed}`;
        }, 1000);
    }

    function revealDetail(type) {
        if (type === "postcode") locationDisplay.textContent = currentLocation.postcode;
        if (type === "street") locationDisplay.textContent = currentLocation.street;
        if (type === "what3words") locationDisplay.textContent = currentLocation.what3words;
    }

    function finishExercise() {
        clearInterval(timer);
        points = Math.max(10 - secondsElapsed, 0);
        pointsDisplay.textContent = points;
    }

    generateButton.addEventListener("click", generateLocation);
    revealPostcodeButton.addEventListener("click", () => revealDetail("postcode"));
    revealStreetButton.addEventListener("click", () => revealDetail("street"));
    revealWhat3WordsButton.addEventListener("click", () => revealDetail("what3words"));
    finishButton.addEventListener("click", finishExercise);
});
