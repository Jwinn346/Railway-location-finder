const jsonFiles = [
    "docs/streets-cambridgeshire-part-aa.geojson",
    "docs/streets-hertfordshire-part-aa.geojson",
    "docs/streets-lincolnshire-part-aa.geojson",
    "docs/streets-london-part-aa.geojson",
    "docs/railways-cambridgeshire.geojson",
    "docs/railways-hertfordshire.geojson",
    "docs/railways-lincolnshire.geojson",
    "docs/railways-london.geojson"
];

let locations = [];
let currentLocation = null;
let startTime = null;

// **Load data and ensure only valid locations are stored**
async function loadLocationData() {
    for (let file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                console.warn(`⚠️ Warning: Failed to load ${file}`);
                continue;
            }

            const text = await response.text();
            if (!text.trim()) {
                console.warn(`⚠️ Warning: Empty JSON file - ${file}`);
                continue;
            }

            try {
                const data = JSON.parse(text);
                if (data.features && data.features.length > 0) {
                    locations = locations.concat(data.features);
                } else {
                    console.warn(`⚠️ Warning: No valid locations in ${file}`);
                }
            } catch (parseError) {
                console.warn(`⚠️ Warning: JSON parsing error in ${file} - ${parseError.message}`);
            }

        } catch (error) {
            console.warn(`⚠️ Warning: Error loading ${file} - ${error.message}`);
        }
    }

    if (locations.length === 0) {
        console.error("❌ No valid location data found.");
        alert("No locations available. Please check the data.");
    } else {
        console.log(`✅ Location data successfully loaded! ${locations.length}`);
    }
}

// **Generate a random location from available data**
function generateLocation() {
    if (locations.length === 0) {
        alert("No locations available.");
        return;
    }

    currentLocation = locations[Math.floor(Math.random() * locations.length)];

    // **Extract details**
    const properties = currentLocation.properties || {};
    const street = properties.name || "Unknown Street";
    const postcode = properties.postcode || "Unknown Postcode";
    const what3words = properties.what3words || "Unknown What3Words";

    // **Show only the primary detail initially**
    document.getElementById("location-display").textContent = "Location Generated!";
    document.getElementById("street-display").textContent = `Street: ${street}`;
    document.getElementById("postcode-display").textContent = `Postcode: ${postcode}`;
    document.getElementById("w3w-display").textContent = `What3Words: ${what3words}`;

    // **Hide additional details until buttons are pressed**
    document.getElementById("street-display").style.display = "none";
    document.getElementById("postcode-display").style.display = "none";
    document.getElementById("w3w-display").style.display = "none";

    startTime = new Date().getTime(); // Start the timer
}

// **Reveal hidden details**
function revealStreet() {
    document.getElementById("street-display").style.display = "block";
}

function revealPostcode() {
    document.getElementById("postcode-display").style.display = "block";
}

function revealW3W() {
    document.getElementById("w3w-display").style.display = "block";
}

// **Finish button calculates score based on time**
function finishExercise() {
    if (!startTime) {
        alert("You need to generate a location first!");
        return;
    }

    const endTime = new Date().getTime();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    let points = 100 - timeTaken;

    if (points < 0) points = 0;

    alert(`Exercise finished! Time: ${timeTaken} seconds. Score: ${points} points.`);
}

// **Event Listeners**
document.getElementById("generate-btn").addEventListener("click", generateLocation);
document.getElementById("reveal-street").addEventListener("click", revealStreet);
document.getElementById("reveal-postcode").addEventListener("click", revealPostcode);
document.getElementById("reveal-w3w").addEventListener("click", revealW3W);
document.getElementById("finish-btn").addEventListener("click", finishExercise);

// **Load locations when page loads**
loadLocationData();
