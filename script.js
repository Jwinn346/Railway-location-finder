document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded!");

    const generateButton = document.getElementById("generateLocation");
    const revealPostcodeButton = document.getElementById("revealPostcode");
    const revealStreetButton = document.getElementById("revealStreet");
    const revealW3WButton = document.getElementById("revealW3W");

    const postcodeElement = document.getElementById("postcode");
    const streetElement = document.getElementById("street");
    const what3wordsElement = document.getElementById("what3words");

    let locationData = [];

    // JSON files stored in /docs/ for GitHub Pages
    const jsonPaths = [
        "docs/railways-london.geojson",
        "docs/railways-hertfordshire.geojson",
        "docs/railways-cambridgeshire.geojson",
        "docs/railways-lincolnshire.geojson"
    ];

    async function loadLocationData() {
        console.log("Loading location data...");
        try {
            const fetches = jsonPaths.map(path => fetch(path).then(response => response.json()));
            const results = await Promise.all(fetches);

            locationData = results.flatMap(result => result.features);
            console.log(`Loaded ${locationData.length} locations.`);
        } catch (error) {
            console.error("Error loading JSON files:", error);
        }
    }

    function getRandomLocation() {
        if (locationData.length === 0) {
            console.warn("No locations loaded!");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * locationData.length);
        return locationData[randomIndex];
    }

    generateButton.addEventListener("click", function () {
        console.log("Generate button clicked.");
        const location = getRandomLocation();
        if (!location) return;

        postcodeElement.textContent = "Hidden";
        streetElement.textContent = "Hidden";
        what3wordsElement.textContent = "Hidden";

        generateButton.dataset.location = JSON.stringify(location);
        console.log("Generated location:", location);
    });

    revealPostcodeButton.addEventListener("click", function () {
        console.log("Reveal postcode clicked.");
        const location = JSON.parse(generateButton.dataset.location || "{}");
        postcodeElement.textContent = location.properties?.postcode || "No postcode available";
    });

    revealStreetButton.addEventListener("click", function () {
        console.log("Reveal street clicked.");
        const location = JSON.parse(generateButton.dataset.location || "{}");
        streetElement.textContent = location.properties?.street || "No street available";
    });

    revealW3WButton.addEventListener("click", function () {
        console.log("Reveal What3Words clicked.");
        const location = JSON.parse(generateButton.dataset.location || "{}");
        what3wordsElement.textContent = location.properties?.what3words || "No W3W available";
    });

    // Load data when the page is ready
    loadLocationData();
});
