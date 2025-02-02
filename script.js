// Wait for the page to fully load before running the script
document.addEventListener("DOMContentLoaded", function() {
  
  // Fetch locations from the JSON file
  fetch('filtered_postcodes.json')
    .then(response => response.json())
    .then(data => {
      // Select a random location
      const randomIndex = Math.floor(Math.random() * data.length);
      const location = data[randomIndex];

      // Display the postcode and street name
      document.getElementById("locationName").textContent = "Postcode: " + location.postcode;
      document.getElementById("streetName").textContent = "Street: " + location.street;

      // Generate Google Maps link
      const googleMapsLink = document.getElementById("googleMapsLink");
      googleMapsLink.href = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lon}`;
      
      // Make the button functional
      googleMapsLink.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default behavior
        window.open(this.href, "_blank");
      });
      
    })
    .catch(error => console.error('Error loading location data:', error));

  // Handle button clicks if they are present
  const generateButton = document.getElementById("generateLocation");
  if (generateButton) {
    generateButton.addEventListener("click", function() {
      window.location.reload(); // Reload the page to get a new location
    });
  }
});
