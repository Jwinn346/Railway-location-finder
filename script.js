document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("generateButton");
    
    if (button) {
        button.addEventListener("click", generateLocation);
    } else {
        console.error("⚠️ Error: 'generateButton' not found in the HTML.");
    }

    loadLocationData();
});

let locations = [];

async function loadLocationData() {
    try {
        const response = await fetch("docs/locations.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        locations = await response.json();
        
        if (locations.length > 0) {
            console.log(`✅ Loaded ${locations.length} locations.`);
        } else {
            throw new Error("No locations found in JSON file.");
        }
    } catch (error) {
        console.error("❌ Error loading location data:", error);
    }
}

function generateLocation() {
    if (locations.length === 0) {
        console.error("❌ No location data available.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];

    document.getElementById("postcode").textContent = location.postcode || "N/A";
    document.getElementById("street").textContent = location.street || "N/A";
    document.getElementById("w3w").textContent = location.w3w || "N/A";
}
