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
            "streets-cambridgeshire-part-ab.geojson",
            "streets-cambridgeshire-part-ac.geojson",
            "streets-cambridgeshire-part-ad.geojson",
            "streets-cambridgeshire-part-ae.geojson",
            "streets-cambridgeshire-part-af.geojson",
            "streets-cambridgeshire-part-ag.geojson",
            "streets-cambridgeshire-part-ah.geojson",
            "streets-cambridgeshire-part-ai.geojson",
            "streets-cambridgeshire-part-aj.geojson",

            "streets-hertfordshire-part-aa.geojson",
            "streets-hertfordshire-part-ab.geojson",

            "streets-lincolnshire-part-aa.geojson",
            "streets-lincolnshire-part-ab.geojson",
            "streets-lincolnshire-part-ac.geojson",

            "streets-london-part-aa.geojson",
            "streets-london-part-ab.geojson",
            "streets-london-part-ac.geojson",
            "streets-london-part-ad.geojson",
            "streets-london-part-ae.geojson",
            "streets-london-part-af.geojson",
            "streets-london-part-ag.geojson",
            "streets-london-part-ah.geojson",
            "streets-london-part-ai.geojson"
        ];

        const basePath = "https://jwinn346.github.io/Railway-location-finder/docs/";

        const fetchPromises = files.map(file => fetch(basePath + file).then(res => {
            if (!res.ok) {
                console.error(`Failed to load ${file}`);
                return null;  // Skip files that fail
            }
            return res.json();
        }));

        const results = await Promise.all(fetchPromises);

        locations = results
            .filter(data => data !== null)  // Remove failed files
            .flatMap(data => data.features || []);

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
    displayLocation(location);
}

// Display location details
function displayLocation(location) {
    const properties = location.properties || {};
    document.getElementById("postcode").textContent = properties.postcode || "Unknown";
    document.getElementById("street").textContent = properties.street || "Unknown";
    document.getElementById("what3words").textContent = properties.what3words || "Unknown";

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
