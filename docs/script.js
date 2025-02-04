document.addEventListener("DOMContentLoaded", async function () {
    console.log("🔹 Script Loaded!");

    const jsonPaths = [
        "docs/railways-london.geojson",
        "docs/railways-hertfordshire.geojson",
        "docs/railways-cambridgeshire.geojson",
        "docs/railways-lincolnshire.geojson"
    ];

    async function loadLocationData() {
        console.log("📡 Fetching JSON data...");
        try {
            const fetches = jsonPaths.map(path =>
                fetch(path)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`❌ Failed to load: ${path} (HTTP ${response.status})`);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error("⚠️ Fetch Error:", error);
                        return null;
                    })
            );

            const results = await Promise.all(fetches);
            const loadedData = results.filter(data => data !== null).flatMap(data => data.features || []);
            console.log(`✅ Successfully loaded ${loadedData.length} locations.`);
            return loadedData;
        } catch (error) {
            console.error("🚨 Critical Error Loading JSON:", error);
            return [];
        }
    }

    const locationData = await loadLocationData();

    if (locationData.length === 0) {
        alert("⚠️ No locations loaded! Check the console for errors.");
        return;
    }

    function getRandomLocation() {
        if (locationData.length === 0) {
            console.warn("⚠️ No locations available.");
            return null;
        }
        return locationData[Math.floor(Math.random() * locationData.length)];
    }

    function updateUIWithLocation(location) {
        if (!location || !location.properties) {
            console.error("❌ Invalid location data.");
            return;
        }
        console.log("📌 Selected Location:", location);

        document.getElementById("postcode").textContent = location.properties.postcode || "N/A";
        document.getElementById("street").textContent = location.properties.street || "N/A";
        document.getElementById("what3words").textContent = location.properties.what3words || "N/A";
    }

    document.getElementById("generateLocation").addEventListener("click", function () {
        console.log("🎲 Generate Button Clicked!");
        const location = getRandomLocation();
        if (location) {
            updateUIWithLocation(location);
        }
    });

    document.getElementById("revealPostcode").addEventListener("click", function () {
        console.log("📍 Reveal Postcode Clicked!");
        document.getElementById("postcode").style.display = "inline";
    });

    document.getElementById("revealStreet").addEventListener("click", function () {
        console.log("🚦 Reveal Street Clicked!");
        document.getElementById("street").style.display = "inline";
    });

    document.getElementById("revealW3W").addEventListener("click", function () {
        console.log("🌍 Reveal What3Words Clicked!");
        document.getElementById("what3words").style.display = "inline";
    });

    console.log("✅ Script Ready!");
});
