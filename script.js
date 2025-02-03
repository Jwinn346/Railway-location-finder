document.addEventListener("DOMContentLoaded", function () {
    let locationData = [];
    let currentLocation = null;
    let timer;
    let timeLeft = 300; // 5 minutes in seconds

    // Fetch location data from JSON file
    async function fetchLocationData() {
        try {
            const response = await fetch("filtered_postcodes.json");
            locationData = await response.json();

            if (locationData.length === 0) {
                console.error("JSON file is empty or not loading correctly.");
                document.getElementById("locationName").textContent = "⚠ No location data available!";
            } else {
                console.log("Location data loaded:", locationData);
            }
        } catch (error) {
            console.error("Error loading location data:", error);
            document.getElementById("locationName").textContent = "⚠ Failed to load location data!";
        }
    }

    // Function to start/reset the timer
    function startTimer() {
        clearInterval(timer);
        timeLeft = 300; // Reset to 5 minutes
        document.getElementById("timer").textContent = `⏳ Timer: 5:00`;
        document.getElementById("hint").classList.add("hidden"); // Reset hint visibility

        timer = setInterval(() => {
            timeLeft--;

            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById("timer").textContent = `⏳ Timer: ${minutes}:${seconds.toString().padStart(2, "0")}`;

            if (timeLeft === 120) {
                document.getElementById("hint").classList.remove("hidden"); // Show hint after 2 mins
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById("timer").textContent = "⏳ Time's up!";
            }
        }, 1000);
    }

    // Generate a random location and reveal one clue
    function generateRandomLocation() {
        if (locationData.length === 0) {
            console.error("Location data is empty.");
            document.getElementById("locationName").textContent = "⚠ No location data available!";
            return;
        }

        // Select a random location
        currentLocation = locationData[Math.floor(Math.random() * locationData.length)];

        if (!currentLocation || !currentLocation.street || !currentLocation.postcode) {
            console.error("Invalid location data:", currentLocation);
            document.getElementById("locationName").textContent = "⚠ Location data error!";
            return;
        }

        // Randomly pick a clue to reveal first (postcode, street, or What3Words)
        let clues = ["postcode", "street", "w3w"];
        let initialClue = clues[Math.floor(Math.random() * clues.length)];

        // Set up the Google Maps link
        let mapsUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}`;
        document.getElementById("googleMapsLink").href = mapsUrl;

        // Hide all details initially
        document.getElementById("postcode").classList.add("hidden");
        document.getElementById("street").classList.add("hidden");
        document.getElementById("w3w").classList.add("hidden");
        document.getElementById("googleMapsLink").classList.add("hidden");
        document.getElementById("w3wLink").classList.add("hidden");

        // Populate details but only reveal one clue
        document.getElementById("postcode").querySelector("span").textContent = currentLocation.postcode;
        document.getElementById("street").querySelector("span").textContent = currentLocation.street;
        document.getElementById("w3w").querySelector("span").textContent = "🔗 Not available"; // Placeholder for W3W data

        // Show only the selected clue
        document.getElementById(initialClue).classList.remove("hidden");

        // Set the main displayed location text
        document.getElementById("locationName").textContent = `🔎 Your starting clue is revealed!`;

        // Start the timer
        startTimer();
    }

    // Reveal additional details
    function revealData(type) {
        if (!currentLocation) {
            console.error("No location selected.");
            return;
        }

        if (type === "postcode") {
            document.getElementById("postcode").classList.remove("hidden");
        } else if (type === "street") {
            document.getElementById("street").classList.remove("hidden");
        } else if (type === "w3w") {
            document.getElementById("w3w").classList.remove("hidden");
        }

        // Show Google Maps link
        document.getElementById("googleMapsLink").classList.remove("hidden");
    }

    // Event Listeners
    document.getElementById("generateLocation").addEventListener("click", generateRandomLocation);
    document.querySelectorAll(".reveal-btn").forEach(button => {
        button.addEventListener("click", function () {
            revealData(this.getAttribute("data-type"));
        });
    });

    // Load the data
    fetchLocationData();
});
