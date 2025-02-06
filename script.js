// Base URL for JSON files stored in the "docs-keep" folder of the "json-storage" branch
const jsonBaseURL = "https://raw.githubusercontent.com/jwinn346/Railway-location-finder/json-storage/docs-keep/";

// List of JSON files to load
const jsonFiles = [
    "streets-cambridgeshire-part-aa.geojson",
    "streets-hertfordshire-part-aa.geojson",
    "streets-lincolnshire-part-aa.geojson",
    "streets-london-part-aa.geojson"
];

let locationData = []; // Stores all loaded locations

// Function to load GeoJSON data
async function loadLocationData() {
    try {
        locationData = [];
        let fetchPromises = jsonFiles.map(async (file) => {
            let response = await fetch(jsonBaseURL + file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            let json = await response.json();
            if (json.features) locationData.push(...json.features);
        });

        await Promise.all(fetchPromises);
        console.log(`✅ Location data successfully loaded! (${locationData.length} locations)`);
    } catch (error) {
        console.error("❌ Error loading location data:", error);
    }
}

// Function to generate a random location
function generateLocation() {
    if (locationData.length === 0) {
        console.error("❌ No location data available.");
        return;
    }

    let randomIndex = Math.floor(Math.random() * locationData.length);
    let selectedLocation = locationData[randomIndex];

    if (!selectedLocation || !selectedLocation.properties) {
        console.error("❌ Invalid location data:", selectedLocation);
        return;
    }

    // Display the location details
    document.getElementById("location-display").textContent = selectedLocation.properties.name || "Unknown Location";
    console.log(`📍 Location selected: ${selectedLocation.properties.name}`);
}

// Event listener for the button
document.getElementById("generate-button").addEventListener("click", generateLocation);

// Load data when the page loads
window.onload = loadLocationData;
