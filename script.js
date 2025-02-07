let locations = [];
let currentLocation = null;
let timer;
let timeRemaining = 60; // 60 seconds per round
let score = 100; // Initial score
let hintsUsed = 0;

// Load location data from test_streets.json
fetch('test_streets.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
  })
  .catch(error => console.error('Error loading locations:', error));

// Function to start a new round
function generateLocation() {
  if (locations.length === 0) {
    alert("Locations data not loaded yet!");
    return;
  }

  // Reset game state
  document.getElementById("location").textContent = "???";
  document.getElementById("streetHint").textContent = "Reveal Street";
  document.getElementById("postcodeHint").textContent = "Reveal Postcode";
  document.getElementById("finishButton").disabled = false;
  document.getElementById("map").innerHTML = ""; // Clear previous map
  document.getElementById("score").textContent = `Score: 100`;
  
  // Reset hints and score
  hintsUsed = 0;
  score = 100;
  timeRemaining = 60;

  // Pick a random location
  currentLocation = locations[Math.floor(Math.random() * locations.length)];
  document.getElementById("location").textContent = "Location Generated!";

  // Start Timer
  clearInterval(timer);
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
    } else {
      endGame();
    }
  }, 1000);
}

// Function to reveal the street name (with penalty)
function revealStreet() {
  if (currentLocation) {
    document.getElementById("location").textContent = currentLocation.street;
    applyPenalty();
  }
}

// Function to reveal the postcode (with penalty)
function revealPostcode() {
  if (currentLocation) {
    document.getElementById("postcodeHint").textContent = currentLocation.postcode;
    applyPenalty();
  }
}

// Apply penalty for using a hint
function applyPenalty() {
  if (score > 0) {
    hintsUsed++;
    score -= 20; // Deduct 20 points per hint used
    document.getElementById("score").textContent = `Score: ${score}`;
  }
}

// Function to finish the round and display full details
function endGame() {
  clearInterval(timer);
  
  if (!currentLocation) return;

  document.getElementById("finishButton").disabled = true;

  let mapUrl = currentLocation.maps_url;
  document.getElementById("map").innerHTML = `
    <p><strong>Street:</strong> ${currentLocation.street}</p>
    <p><strong>Postcode:</strong> ${currentLocation.postcode}</p>
    <p><strong>Google Maps:</strong> <a href="${mapUrl}" target="_blank">View Location</a></p>
    <iframe src="${mapUrl}&output=embed" width="300" height="300"></iframe>
  `;

  document.getElementById("finalScore").textContent = `Final Score: ${score}`;
}
