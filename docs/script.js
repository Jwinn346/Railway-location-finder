let locations = [];
let locationLoaded = false;

// Load railway and street location data
async function loadLocationData() {
    try {
        const railwayLondon = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/railways-london.geojson").then(res => res.json());
        const railwayHertfordshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/railways-hertfordshire.geojson").then(res => res.json());
        const railwayCambridgeshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/railways-cambridgeshire.geojson").then(res => res.json());
        const railwayLincolnshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/railways-lincolnshire.geojson").then(res => res.json());

        const streetsLondon = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/streets-london.geojson").then(res => res.json());
        const streetsHertfordshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/streets-hertfordshire.geojson").then(res => res.json());
        const streetsCambridgeshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/streets-cambridgeshire.geojson").then(res => res.json());
        const streetsLincolnshire = await fetch("https://jwinn346.github.io/Railway-location-finder/docs/streets-lincolnshire.geojson").then(res => res.json());

        // Combine all location data
        locations = [
            ...railwayLondon.features,
            ...railwayHertfordshire.features,
            ...railwayCambridgeshire.features,
            ...railwayLincolnshire.features,
            ...streetsLondon.features,
            ...streetsHertfordshire.features,
            ...streetsCambridgeshire.features,
            ...streetsLincolnshire.features
        ];

        console.log("Location data successfully loaded!", locations);
        locationLoaded = true;
    } catch (error) {
        console.error("Error loading location data:", error);
    }
}

// Generate a random location
function generateLocation() {
    if (!locationLoaded || locations.length === 0) {
        alert("Location data is still loading...");
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
