async function loadLocationData() {
    let validFiles = 0; // Track the number of valid JSON files
    let totalLocations = 0; // Track total number of locations added

    for (let file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                console.warn(`⚠️ Warning: Failed to load ${file}`);
                continue;
            }

            const text = await response.text().trim(); // Remove extra whitespace
            if (!text || text === "{}" || text === "[]" || text === "null") {
                console.warn(`⚠️ Warning: Empty or invalid JSON file - ${file}`);
                continue;
            }

            try {
                const data = JSON.parse(text);
                if (data.features && data.features.length > 0) {
                    locations = locations.concat(data.features);
                    validFiles++;
                    totalLocations += data.features.length;
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

    if (validFiles === 0) {
        console.error("❌ No valid location data found. Only railway data may be available.");
        alert("⚠️ Only railway locations available. Please check street data files.");
    } else {
        console.log(`✅ Location data successfully loaded! ${totalLocations} locations available.`);
    }
}
