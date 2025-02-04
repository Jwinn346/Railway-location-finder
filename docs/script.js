document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generate");
    const revealPostcodeBtn = document.getElementById("revealPostcode");
    const revealStreetBtn = document.getElementById("revealStreet");
    const revealW3WBtn = document.getElementById("revealW3W");

    const postcodeEl = document.getElementById("postcode");
    const streetEl = document.getElementById("street");
    const w3wEl = document.getElementById("w3w");
    const googleMapsEl = document.getElementById("googleMaps");
    const what3wordsEl = document.getElementById("what3words");

    let locationData = [];

    // ✅ Check if JSON loads
    fetch("filtered_postcodes.json")
        .then(response => {
            if (!response.ok) throw new Error("JSON not found!");
            return response.json();
        })
        .then(data => {
            console.log("JSON Loaded:", data); // 🔍 Debugging
            locationData = data;
        })
        .catch(error => console.error("Error loading JSON:", error));

    // ✅ Generate Random Location
    generateBtn.addEventListener("click", function () {
        if (locationData.length === 0) {
            alert("Location data is still loading...");
            return;
        }

        const randomLocation = locationData[Math.floor(Math.random() * locationData.length)];

        postcodeEl.innerText = "Hidden";
        streetEl.innerText = "Hidden";
        w3wEl.innerText = "Hidden";

        googleMapsEl.href = `https://www.google.com/maps?q=${randomLocation.lat},${randomLocation.lon}`;
        what3wordsEl.href = `https://what3words.com/${randomLocation.w3w}`;
    });

    // ✅ Reveal Postcode
    revealPostcodeBtn.addEventListener("click", function () {
        postcodeEl.innerText = locationData.length > 0 ? locationData[0].postcode : "N/A";
    });

    // ✅ Reveal Street Name
    revealStreetBtn.addEventListener("click", function () {
        streetEl.innerText = locationData.length > 0 ? locationData[0].street : "N/A";
    });

    // ✅ Reveal What3Words
    revealW3WBtn.addEventListener("click", function () {
        w3wEl.innerText = locationData.length > 0 ? locationData[0].w3w : "N/A";
    });
});
