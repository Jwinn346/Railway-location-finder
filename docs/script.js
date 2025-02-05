let locations = [];
let locationLoaded = false;

async function loadLocationData() {
    try {
        const files = [
            "railways-london.geojson",
            "railways-hertfordshire.geojson",
            "railways-cambridgeshire.geojson",
            "railways-lincolnshire.geojson",
            "streets-london.geojson",
            "streets-hertfordshire.geojson",
            "streets-cambridgeshire.geojson",
            "streets-lincolnshire.geojson"
        ];

        // ✅ Updated basePath (removes /docs/)
        const basePath = "https://jwinn346.github.io/Railway-location-finder/";

        const fetchPromises = files.map(file => fetch(basePath + file).then(res => {
            if (!res.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            return res.json();
        }));

        const results = await Promise.all(fetchPromises);

        locations = results.flatMap(data => data.features || []);

        if (locations.length === 0) {
            throw new Error("No locations found in JSON files.");
        }

        console.log("✅ Location data successfully loaded!", locations);
        locationLoaded = true;
    } catch (error) {
        console.error("❌ Error loading railway location data:", error);
        alert("Error loading location data. Check console for details.");
    }
}

// Generate a random location
function generateLocation() {
    if (!locationLoaded || locations.length === 0) {
        alert("⚠️ Location data is still loading...");
        return;
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];
    displayLocation(location);
}

// Display location details
function displayLocation(location) {
    const properties = location.properties || {};
    document.getElementById("postcode").textContent = properties.postcode || "Unknown";
    document.getElementById("street").textContent = properties.street || "Unknown";
    document.getElementById("what3words").textContent = properties.what3words || "Unknown";

    // Update Google Maps and What3Words links
    if (properties.latitude && properties.longitude) {
        document.getElementById("google-maps-link").href = `https://www.google.com/maps?q=${properties.latitude},${properties.longitude}`;
    } else {
        document.getElementById("google-maps-link").href = "#";
    }

    if (properties.what3words) {
        document.getElementById("what3words-link").href = `https://what3words.com/${properties.what3words}`;
    } else {
        document.getElementById("what3words-link").href = "#";
    }
}

// Event listeners
document.getElementById("generate-btn").addEventListener("click", generateLocation);

// Load data on page load
window.onload = loadLocationData;
