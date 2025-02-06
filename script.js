document.addEventListener("DOMContentLoaded", async function () {
    const locationDisplay = document.getElementById("location-display");
    const generateBtn = document.getElementById("generate-btn");
    const revealBtn = document.getElementById("reveal-btn");
    const finishBtn = document.getElementById("finish-btn");
    const timerDisplay = document.getElementById("timer");

    let locationData = [];
    let countdown;

    // List of GeoJSON files to load
    const fileList = [
        "railways-cambridgeshire.geojson",
        "railways-hertfordshire.geojson",
        "railways-lincolnshire.geojson",
        "railways-london.geojson",
        "streets-cambridgeshire-part-aa.geojson",
        "streets-cambridgeshire-part-ab.geojson",
        "streets-cambridgeshire-part-ac.geojson",
        "streets-hertfordshire-part-aa.geojson",
        "streets-hertfordshire-part-ab.geojson",
        "streets-lincolnshire-part-aa.geojson",
        "streets-lincolnshire-part-ab.geojson",
        "streets-london-part-aa.geojson",
        "streets-london-part-ab.geojson",
        "streets-london-part-ac.geojson"
    ];

    async function loadLocationData() {
        locationData = []; // Clear existing data

        for (let file of fileList) {
            try {
                let response = await fetch(`docs/${file}`);
                if (!response.ok) {
                    console.warn(`⚠️ Skipping: ${file} (Not Found)`);
                    continue;
                }

                let jsonData = await response.json();

                if (!jsonData || !jsonData.features || jsonData.features.length === 0) {
                    console.warn(`⚠️ Skipping: ${file} (Empty JSON)`);
                    continue; // Skip empty files
                }

                // Extract valid features (postcodes, streets, What3Words)
                let validLocations = jsonData.features
                    .map(f => f.properties)
                    .filter(p => p.postcode || p.street || p.what3words);

                if (validLocations.length > 0) {
                    locationData = locationData.concat(validLocations);
                    console.log(`✅ Loaded: ${file} (${validLocations.length} locations)`);
                } else {
                    console.warn(`⚠️ Skipping: ${file} (No useful data)`);
                }

            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error);
            }
        }

        if (locationData.length === 0) {
            console.error("❌ No valid location data available.");
        } else {
            console.log(`✅ Total locations loaded: ${locationData.length}`);
        }
    }

    function generateLocation() {
        if (locationData.length === 0) {
            locationDisplay.textContent = "No locations available.";
            return;
        }

        let randomLocation = locationData[Math.floor(Math.random() * locationData.length)];

        // Display one random field, hide the others
        let visibleField = Math.random() < 0.5 ? "postcode" : "street";
        locationDisplay.innerHTML = `<strong>Location:</strong> ${randomLocation[visibleField] || "Unknown"}`;

        revealBtn.dataset.postcode = randomLocation.postcode || "Unknown";
        revealBtn.dataset.street = randomLocation.street || "Unknown";
        revealBtn.dataset.what3words = randomLocation.what3words || "Unknown";
        revealBtn.style.display = "inline-block";

        startTimer();
    }

    function revealDetails() {
        locationDisplay.innerHTML = `
            <strong>Postcode:</strong> ${revealBtn.dataset.postcode} <br>
            <strong>Street:</strong> ${revealBtn.dataset.street} <br>
            <strong>What3Words:</strong> ${revealBtn.dataset.what3words}
        `;
    }

    function startTimer() {
        clearInterval(countdown);
        let timeLeft = 300;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
            if (timeLeft === 0) clearInterval(countdown);
        }, 1000);
    }

    function finishExercise() {
        clearInterval(countdown);
        let timeTaken = 300 - parseInt(timerDisplay.textContent.replace(/\D/g, ""));
        locationDisplay.innerHTML = `✅ Exercise Complete! <br> Time Taken: ${timeTaken} seconds`;
    }

    generateBtn.addEventListener("click", generateLocation);
    revealBtn.addEventListener("click", revealDetails);
    finishBtn.addEventListener("click", finishExercise);

    await loadLocationData(); // Load locations on startup
});
