document.addEventListener("DOMContentLoaded", async function() {
    const locationDisplay = document.getElementById("location-display");
    const generateBtn = document.getElementById("generate-btn");
    const revealBtn = document.getElementById("reveal-btn");
    const finishBtn = document.getElementById("finish-btn");
    const timerDisplay = document.getElementById("timer");

    let locationData = [];
    let countdown;
    
    async function loadLocationData() {
        const fileList = [
            "railways-cambridgeshire.geojson",
            "railways-hertfordshire.geojson",
            "railways-lincolnshire.geojson",
            "railways-london.geojson",
            "streets-cambridgeshire-part-aa.geojson",
            "streets-cambridgeshire-part-ab.geojson",
            "streets-cambridgeshire-part-ac.geojson",
            "streets-cambridgeshire-part-ad.geojson",
            "streets-hertfordshire-part-aa.geojson",
            "streets-hertfordshire-part-ab.geojson",
            "streets-lincolnshire-part-aa.geojson",
            "streets-lincolnshire-part-ab.geojson",
            "streets-london-part-aa.geojson",
            "streets-london-part-ab.geojson",
            "streets-london-part-ac.geojson"
        ];

        for (const file of fileList) {
            try {
                const response = await fetch(`docs/${file}`);
                if (!response.ok) {
                    console.warn(`⚠️ Warning: Failed to load ${file}`);
                    continue;  // Skip this file
                }
                
                const jsonData = await response.json();
                if (Object.keys(jsonData).length === 0) {
                    console.warn(`⚠️ Warning: Empty JSON file - ${file}`);
                    continue;  // Skip empty JSON files
                }

                locationData.push(...jsonData.features);
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error);
            }
        }

        if (locationData.length > 0) {
            console.log(`✅ Location data successfully loaded! ${locationData.length} locations`);
        } else {
            console.error("❌ No location data available.");
        }
    }

    function startTimer() {
        let timeLeft = 300; // 5 minutes
        timerDisplay.textContent = `Time left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;

        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                alert("⏳ Time's up!");
                revealBtn.style.display = "none";
                finishBtn.style.display = "none";
            }
        }, 1000);
    }

    generateBtn.addEventListener("click", function() {
        if (locationData.length === 0) {
            locationDisplay.textContent = "⚠️ No locations available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * locationData.length);
        const selectedLocation = locationData[randomIndex];

        locationDisplay.textContent = "📍 Location generated!";
        revealBtn.style.display = "inline-block";
        finishBtn.style.display = "inline-block";

        startTimer();
    });

    revealBtn.addEventListener("click", function() {
        locationDisplay.textContent = `📍 ${JSON.stringify(locationData[Math.floor(Math.random() * locationData.length)])}`;
    });

    finishBtn.addEventListener("click", function() {
        clearInterval(countdown);
        alert("✅ Exercise Completed!");
        locationDisplay.textContent = "🎉 Well done!";
        revealBtn.style.display = "none";
        finishBtn.style.display = "none";
    });

    loadLocationData();
});
