// Fetch locations from the JSON file
fetch('filtered_postcodes.json')
  .then(response => response.json())
  .then(data => {
    // Select a random location
    const randomIndex = Math.floor(Math.random() * data.length);
    const location = data[randomIndex];

    // Display the location details
    document.getElementById("locationName").textContent = location.postcode;

    // Generate Google Maps link
    document.getElementById("googleMapsLink").href = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lon}`;
  })
  .catch(error => console.error('Error loading location data:', error));