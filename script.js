let locations = [];
let locationLoaded = false;
let hintTimeout;

async function loadLocationData() {
    try {
        const files = [
            "streets-london.geojson",
            "streets-hertfordshire.geojson",
            "streets-cambridgeshire.geojson",
            "streets-lincolnshire.geojson"
        ];

        const basePath = "https://jwinn346.github.io/Railway-location-finder/docs/";

        const fetchPromises = files.map(file => fetch(basePath + file).then(res => {
            if (!res.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return res.json();
        }));

        const results = await Promise.all(fetchPromises);

        // ✅ Flatten street features into one array
        locations = results.flatMap(data => data.features || []);

        if (locations.length === 0) {
            throw new Error("No locations found in street JSON files.");
        }

        console.log("✅ Street location data successfully loaded!", locations);
        locationLoaded = true;
    } catch (error) {
        console.error("❌ Error loading street location data:", error);
        alert("Error loading street location data. Check console for details.");
    }
}

// ✅ Generate a random street location
function generateLocation() {
    if (!locationLoaded || locations.length === 0) {
        alert("⚠️ Street location data is still loading...");
        return;
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];
    displayLocation(location);

    // ✅ Start hint timer
    startHintTimer(location);
}

// ✅ Display street location details
function displayLocation(location) {
    const properties = location.properties || {};
    const coordinates = location.geometry?.coordinates || [];

    document.getElementById("street-name").textContent = properties.name || "Unknown Street";
    document.getElementById("postcode").textContent = properties.postcode || "Unknown Postcode";
    document.getElementById("what3words").textContent = properties.what3words || "Unknown What3Words";

    // ✅ Update Google Maps link if coordinates exist
    if (coordinates.length > 0) {
        const [longitude, latitude] = coordinates[0]; // Take the first coordinate point
        document.getElementById("google-maps-link").href = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } else {
        document.getElementById("google-maps-link").href = "#";
    }
}

// ✅ Timer function for hints
function startHintTimer(location) {
    clearTimeout(hintTimeout); // Clear any existing hint timer
    let hintGiven = false;

    hintTimeout = setTimeout(() => {
        if (!hintGiven) {
            document.getElementById("hint").textContent = `Hint: The street name starts with '${location.properties.name?.charAt(0) || "?"}'`;
            hintGiven = true;
        }
    }, 2000); // Hint appears after 2 seconds
}

// ✅ Event Listeners
document.getElementById("generate-btn").addEventListener("click", generateLocation);
document.getElementById("finish-btn").addEventListener("click", () => {
    alert("Training session complete.");
});

// ✅ Load street data on page load
window.onload = loadLocationData;
