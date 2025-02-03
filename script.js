document.addEventListener("DOMContentLoaded", function () {
    let currentLocation = null;
    let timerInterval;
    let hintTimeout;

    // Function to fetch JSON data and generate a location
    function fetchLocationData() {
        fetch('filtered_postcodes.json')
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    console.error('No data available in the JSON file.');
                    return;
                }

                const randomIndex = Math.floor(Math.random() * data.length);
                currentLocation = data[randomIndex];

                console.log("Generated Location:", currentLocation);

                // Ensure required fields exist
                document.getElementById("locationName").textContent = "🔍 Location generated!";
                document.getElementById("postcode").classList.add("hidden");
                document.getElementById("street").classList.add("hidden");
                document.getElementById("w3w").classList.add("hidden");
                document.getElementById("googleMapsLink").classList.add("hidden");
                document.getElementById("w3wLink").classList.add("hidden");

                // Start a 5-minute timer
                startTimer();
            })
            .catch(error => console.error('Error loading location data:', error));
    }

    // Function to reveal information when buttons are clicked
    function revealInfo(event) {
        if (!currentLocation) {
            alert("Please generate a location first!");
            return;
        }

        const type = event.target.getAttribute("data-type");
        const element = document.getElementById(type);

        if (element) {
            element.classList.remove("hidden");
            if (type === "postcode") {
                element.querySelector("span").textContent = currentLocation.postcode || "Not available";
            } else if (type === "street") {
                element.querySelector("span").textContent = currentLocation.street || "Not available";
            } else if (type === "w3w") {
                element.querySelector("span").textContent = currentLocation.w3w || "Not available";
            }

            // Update Google Maps link
            if (currentLocation.lat && currentLocation.lon) {
                document.getElementById("googleMapsLink").href = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lon}`;
                document.getElementById("googleMapsLink").classList.remove("hidden");
            }
        }
    }

    // Timer function
    function startTimer() {
        let timeLeft = 300; // 5 minutes
        document.getElementById("timer").textContent = `⏳ Timer: 5:00`;

        // Reset previous intervals if they exist
        if (timerInterval) clearInterval(timerInterval);
        if (hintTimeout) clearTimeout(hintTimeout);

        timerInterval = setInterval(() => {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById("timer").textContent = `⏳ Timer: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById("timer").textContent = "⏳ Timer: Time's up!";
            }
        }, 1000);

        // Show hint after 2 minutes
        hintTimeout = setTimeout(() => {
            document.getElementById("hint").classList.remove("hidden");
        }, 120000); // 2 minutes
    }

    // Event Listeners
    document.getElementById("generateLocation").addEventListener("click", fetchLocationData);
    document.querySelectorAll(".reveal-btn").forEach(button => {
        button.addEventListener("click", revealInfo);
    });
});
