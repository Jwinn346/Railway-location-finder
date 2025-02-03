document.addEventListener("DOMContentLoaded", function() {
  let currentLocation = null;

  // Function to fetch JSON data and generate a location
  function fetchLocationData() {
    fetch('points.json')  // Make sure the filename matches
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        currentLocation = data[randomIndex];

        // Display the location
        document.getElementById("locationName").textContent = `📍 Postcode: ${currentLocation.postcode}`;

        // Hide previous data
        document.getElementById("postcode").classList.add("hidden");
        document.getElementById("street").classList.add("hidden");
        document.getElementById("w3w").classList.add("hidden");
        document.getElementById("googleMapsLink").classList.add("hidden");
        document.getElementById("w3wLink").classList.add("hidden");
      })
      .catch(error => console.error('Error loading location data:', error));
  }

  // Event listener for "Generate Random Location" button
  document.getElementById("generateLocation").addEventListener("click", fetchLocationData);
});
