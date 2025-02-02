// Wait for the page to fully load before running the script
document.addEventListener("DOMContentLoaded", function() {
  
  // Fetch locations from the JSON file
  fetch('filtered_postcodes.json')
    .then(response => response.json())
    .then(data => {
      let currentLocation = null;

      // Function to display the random location
      function generateLocation() {
        const randomIndex = Math.floor(Math.random() * data.length);
        currentLocation = data[randomIndex];

        // Reset displayed values
        document.getElementById("locationName").textContent = "Location generated! Click a button to reveal details.";
        document.getElementById("postcode").classList.add("hidden");
        document.getElementById("street").classList.add("hidden");
        document.getElementById("w3w").classList.add("hidden");
        document.getElementById("googleMapsLink").classList.add("hidden");
        document.getElementById("w3wLink").classList.add("hidden");
      }

      // Event listener for "Generate Random Location" button
      document.getElementById("generateLocation").addEventListener("click", generateLocation);

      // Event listeners for reveal buttons
      document.querySelectorAll(".reveal-btn").forEach(button => {
        button.addEventListener("click", function() {
          if (!currentLocation) return;

          const type = this.getAttribute("data-type");
          if (type === "postcode") {
            document.getElementById("postcode").querySelector("span").textContent = currentLocation.postcode;
            document.getElementById("postcode").classList.remove("hidden");
          } else if (type === "street") {
            document.getElementById("street").querySelector("span").textContent = currentLocation.street;
            document.getElementById("street").classList.remove("hidden");
          } else if (type === "w3w") {
            document.getElementById("w3w").querySelector("span").textContent = currentLocation.what3words || "Not Available";
            document.getElementById("w3w").classList.remove("hidden");
          }

          // Update Google Maps and What3Words links
          document.getElementById("googleMapsLink").href = `https://www.google.com/maps?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lon}`;
          document.getElementById("googleMapsLink").classList.remove("hidden");

          if (currentLocation.what3words) {
            document.getElementById("w3wLink").href = `https://what3words.com/${currentLocation.what3words}`;
            document.getElementById("w3wLink").classList.remove("hidden");
          }
        });
      });

    })
    .catch(error => console.error('Error loading location data:', error));
});
