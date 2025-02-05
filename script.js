let locations = [];
let locationLoaded = false;
let hintTimeout;

async function loadLocationData() {
    try {
        const files = [
            "railways-london.geojson",
            "railways-hertfordshire.geojson",
            "railways-cambridgeshire.geojson",
            "railways-lincolnshire.geojson"
        ];

        const basePath = "https://jwinn346.github.io/Railway-location-finder/docs/";

        const fetchPromises = files.map(file => fetch(basePath + file).then(res => {
            if (!res.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return res.json();
        }));

        const results = await Promise.all(fetchPromises);

        // ✅ Extract railway features
        locations = results.flatMap(data => data.features || []);

        if (locations.length === 0) {
            throw new Error("No locations found in railway JSON files.");
        }

        console.log("✅ Railway location data successfully loaded!", locations);
        locationLoaded = true;
    } catch (error) {
        console.error("❌ Error loading railway location data:", error);
        alert("Error loading railway location data. Check console for details.");
    }
}

// ✅ Generate a random railway location
function generateLocation() {
    if (!locationLoaded || locations.length === 0) {
        alert("⚠️ Railway location data is still loading...");
        return;
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];
    displayLocation(location);

    // ✅ Start hint timer
    startHintTimer(location);
}

// ✅ Display railway location details
function displayLocation(location) {
    const properties = location.properties || {};
    const coordinates = location.geometry?.coordinates || [];

    document.getElementById("location-name").textContent = properties.name || "Unknown Railway Line";
    document.getElementById("osm-id").textContent = properties.osm_id || "Unknown ID";
    document.getElementById("other-tags").textContent = properties.other_tags || "No additional data";

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
            document.getElementById("hint").textContent = `Hint: The railway line name starts with '${location.properties.name?.charAt(0) || "?"}'`;
            hintGiven = true;
        }
    }, 2000); // Hint appears after 2 seconds
}

// ✅ Event Listeners
document.getElementById("generate-btn").addEventListener("click", generateLocation);

// ✅ Load railway data on page load
window.onload = loadLocationData;
