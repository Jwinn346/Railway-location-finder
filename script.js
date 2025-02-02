document.addEventListener("DOMContentLoaded", function() {
  let currentLocation = null;
  let timerInterval;
  const totalTime = 5 * 60; // 5 minutes in seconds
  const hintTime = 2 * 60; // 2 minutes in seconds

  // Function to start the timer
  function startTimer() {
    let timeLeft = totalTime;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! The correct location was: " + currentLocation.street + ", " + currentLocation.postcode);
      } else if (timeLeft === hintTime) {
        document.getElementById("hint").textContent = "Hint: The street name is " + currentLocation.street;
      }
      updateTimerDisplay(timeLeft);
      timeLeft--;
    }, 1000);
  }

  // Function to update the timer display
  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById("timer").textContent = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Function to fetch JSON data and generate a location
  function fetchLocationData() {
    fetch('filtered_postcodes.json')
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        currentLocation = data[randomIndex];

        // Display the postcode immediately
        document.getElementById("locationName").textContent = `Postcode: ${currentLocation.postcode}`;

        // Hide previous data
        document.getElementById("hint").textContent = "";
        document.getElementById("postcode").classList.add("hidden");
        document.getElementById("street").classList.add("hidden");
        document.getElementById("w3w").classList.add("hidden");
        document.getElementById("googleMapsLink").classList.add("hidden");
        document.getElementById("w3wLink").classList.add("hidden");

        // Start the timer
        startTimer();
      })
      .catch(error => console.error('Error loading location data:', error));
  }

  // Event listener for "Generate Random Location" button
  document.getElementById("generateLocation").addEventListener("click", fetchLocationData);

  // Event listeners for reveal buttons
  document.querySelectorAll(".reveal-btn").forEach(button => {
    button.addEventListener("click", function() {
      if (!currentLocation) {
        alert("Please generate a location first!");
        return;
      }

      const type = this.getAttribute("data-type");

      if (type === "postcode") {
        document.getElementById("postcode").querySelector("span").textContent = currentLocation.postcode;
        document.getElementById("postcode").classList.remove("hidden");
      } else if (type === "street") {
        document.getElementById("street").querySelector("span").textContent = currentLocation.street || "Street not available";
        document.getElementById("street").classList.remove("hidden");
      } else if (type === "w3w") {
        document.getElementById("w3w").querySelector("span").textContent = currentLocation.what3words || "What3Words not available";
        document.getElementById("w3w").classList.remove("hidden");
      }

      // Update Google Maps and What3Words links
      document.getElementById("googleMapsLink").href = `https://www.google.com/maps?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lon}`;
      document.getElementById("googleMapsLink").classList.remove("hidden");

      if (currentLocation.what3words) {
        document.getElementById("w3wLink").href = `https://what3words.com/${currentLocation.what3words}`;
        document.getElementById("w3wLink").classList.remove53
