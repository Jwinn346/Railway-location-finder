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

async function loadLocationData() {
    let locations = [];

    for (let file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                console.warn(`⚠️ Skipping ${file}: HTTP error ${response.status}`);
                continue;
            }

            const text = await response.text();
            if (!text.trim()) {
                console.warn(`⚠️ Skipping ${file}: Empty JSON file`);
                continue;
            }

            try {
                const data = JSON.parse(text);
                if (data.features && data.features.length > 0) {
                    locations = locations.concat(data.features);
                } else {
                    console.warn(`⚠️ Skipping ${file}: No valid locations found`);
                }
            } catch (parseError) {
                console.warn(`⚠️ Skipping ${file}: JSON parsing error - ${parseError.message}`);
            }

        } catch (error) {
            console.warn(`⚠️ Skipping ${file}: ${error.message}`);
        }
    }

    if (locations.length === 0) {
        console.error("❌ No valid location data found.");
        alert("No locations available. Please check the data.");
    } else {
        console.log(`✅ Loaded ${locations.length} locations.`);
    }

    return locations;
}

// Load data on startup
loadLocationData();
