let locations = [];
let locationLoaded = false;

async function loadLocationData() {
    try {
        const files = [
            "railways-london.geojson",
            "railways-hertfordshire.geojson",
            "railways-cambridgeshire.geojson",
            "railways-lincolnshire.geojson",
            "streets-cambridgeshire-part-aa.geojson",
            "streets-hertfordshire-part-aa.geojson",
            "streets-lincolnshire-part-aa.geojson",
            "streets-london-part-aa.geojson"
        ];

        // ✅ Use Raw GitHub URLs
        const basePath = "https://raw.githubusercontent.com/jwinn346/Railway-location-finder/json-storage/docs/";

        const fetchPromises = files.map(file => 
            fetch(basePath + file)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${file}`);
                    return res.json();
                })
                .catch(error => {
                    console.error(`Failed to load ${file}`, error);
                    return null;  // Skip this file if it fails
                })
        );

        const results = await Promise.all(fetchPromises);

        // ✅ Filter out any failed loads
        locations = results
            .filter(data => data && data.features)
            .flatMap(data => data.features);

        if (locations.length === 0) {
            throw new Error("No locations found in JSON files.");
        }

        console.log("✅ Location data successfully loaded!", locations);
        locationLoaded = true;
    } catch (error) {
        console.error("❌ Error loading location data:", error);
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

    if (!location || !location.properties) {
        alert("⚠️ No valid location found.");
        return;
    }

    displayLocation(location);
}

// Display location details
function displayLocation(location) {
    const properties = location.properties || {};

    document.getElementById("postcode").textContent = properties.postcode || "Unknown";
    document.getElementById("street").textContent = properties.street || "Unknown";
    document.getElementById("what3words").textContent = properties.what3words || "Unknown";

    // Update Google Maps and What3Words links
    document.getElementById("google-maps-link").href = properties.latitude && properties.longitude 
        ? `https://www.google.com/maps?q=${properties.latitude},${properties.longitude}` 
        : "#";

    document.getElementById("what3words-link").href = properties.what3words 
        ? `https://what3words.com/${properties.what3words}` 
        : "#";
}

// Ensure all elements exist before running event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate-btn").addEventListener("click", generateLocation);
    loadLocationData();
});
