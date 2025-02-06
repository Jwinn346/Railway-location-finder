document.addEventListener("DOMContentLoaded", async function () {
    const generateBtn = document.getElementById("generate-btn");
    const revealBtn = document.getElementById("reveal-btn");
    const finishBtn = document.getElementById("finish-btn");
    const locationDisplay = document.getElementById("location-display");
    const timerDisplay = document.getElementById("timer");

    if (!generateBtn || !revealBtn || !finishBtn || !locationDisplay) {
        console.error("❌ ERROR: Missing elements in index.html. Check button IDs!");
        return;
    }

    let locations = [];
    let selectedLocation = null;
    let timerInterval = null;
    let timeLeft = 300; // 5 minutes
    let points = 100;

    async function fetchDirectoryListing() {
        try {
            const response = await fetch("docs/");  // Try fetching directory contents (GitHub Pages doesn't allow this natively)
            if (!response.ok) throw new Error("Failed to retrieve directory listing.");
            return await response.json(); // If your hosting supports directory listing
        } catch (error) {
            console.warn("⚠️ Unable to fetch directory listing, using predefined file structure.");
            return [
                "railways-cambridgeshire.geojson",
                "railways-hertfordshire.geojson",
                "railways-lincolnshire.geojson",
                "railways-london.geojson",
                "streets-cambridgeshire-part-aa.geojson",
                "streets-cambridgeshire-part-ab.geojson",
                "streets-cambridgeshire-part-ac.geojson",
                "streets-cambridgeshire-part-ad.geojson",
                "streets-hertfordshire-part-aa.geojson",
                "streets-hertfordshire-part-ab.geojson",
                "streets-lincolnshire-part-aa.geojson",
                "streets-lincolnshire-part-ab.geojson",
                "streets-london-part-aa.geojson",
                "streets-london-part-ab.geojson",
                "streets-london-part-ac.geojson"
            ];
        }
    }

    async function loadLocationData() {
        const jsonFiles = await fetchDirectoryListing();

        locations = [];
        for (const file of jsonFiles) {
            try {
                const filePath = `docs/${file}`;
                const response = await fetch(filePath);
                if (!response.ok) {
                    console.warn(`⚠️ Warning: Failed to load ${filePath}`);
                    continue;
                }

                const data = await response.json();
                if (!data || data.features?.length === 0) {
                    console.warn(`⚠️ Warning: Empty JSON file - ${filePath}`);
                    continue;
                }

                locations.push(...data.features);
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error);
            }
        }

        if (locations.length > 0) {
            console.log(`✅ Location data successfully loaded! ${locations.length} locations available.`);
        } else {
            console.error("❌ No location data available.");
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 300;
        points = 100;

        timerInterval = setInterval(() => {
            timeLeft--;

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

            if (timeLeft === 120) {
                revealBtn.style.display = "inline-block";
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's up!";
                locationDisplay.textContent = "❌ Time's up! No points awarded.";
            }
        }, 1000);
    }

    function getRandomLocation() {
        if (locations.length === 0) {
            locationDisplay.textContent = "❌ No locations available.";
            return;
        }

        selectedLocation = locations[Math.floor(Math.random() * locations.length)];
        locationDisplay.textContent = "📍 Location generated! Press 'Reveal Details' to see more.";
        revealBtn.style.display = "inline-block";
        finishBtn.style.display = "none";

        startTimer();
    }

    function revealLocation() {
        if (!selectedLocation) return;

        let props = selectedLocation.properties;
        let locationText = `
            🏡 Street: ${props.street || "Unknown"}<br>
            📌 Postcode: ${props.postcode || "Unknown"}<br>
            🌎 What3Words: ${props.what3words || "Unknown"}
        `;

        locationDisplay.innerHTML = locationText;
        finishBtn.style.display = "inline-block";
    }

    function finishExercise() {
        clearInterval(timerInterval);
        locationDisplay.textContent = `✅ Exercise completed! You scored ${points} points.`;
        revealBtn.style.display = "none";
        finishBtn.style.display = "none";
    }

    generateBtn.addEventListener("click", getRandomLocation);
    revealBtn.addEventListener("click", revealLocation);
    finishBtn.addEventListener("click", finishExercise);

    await loadLocationData();
});
