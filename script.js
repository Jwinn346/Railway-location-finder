document.getElementById("generateLocation").addEventListener("click", function() {
    // Placeholder data (replace with your database/API)
    let locations = [
        { name: "Near King's Cross", postcode: "N1C 4AG", street: "York Way", w3w: "apple.orange.banana", lat: 51.5319, lng: -0.1245 },
        { name: "Peterborough Station", postcode: "PE1 1QL", street: "Station Road", w3w: "train.ticket.arrival", lat: 52.5746, lng: -0.2434 }
    ];

    let randomLocation = locations[Math.floor(Math.random() * locations.length)];

    document.getElementById("locationName").textContent = randomLocation.name;
    document.getElementById("postcode").querySelector("span").textContent = randomLocation.postcode;
    document.getElementById("street").querySelector("span").textContent = randomLocation.street;
    document.getElementById("w3w").querySelector("span").textContent = randomLocation.w3w;

    document.getElementById("googleMapsLink").href = `https://www.google.com/maps?q=${randomLocation.lat},${randomLocation.lng}`;
    document.getElementById("w3wLink").href = `https://what3words.com/${randomLocation.w3w}`;

    // Hide everything until buttons are clicked
    document.querySelectorAll(".hidden").forEach(el => el.classList.add("hidden"));
});

document.querySelectorAll(".reveal-btn").forEach(button => {
    button.addEventListener("click", function() {
        let type = this.getAttribute("data-type");
        document.getElementById(type).classList.remove("hidden");

        if (type === "w3w") {
            document.getElementById("w3wLink").classList.remove("hidden");
        } else if (type === "postcode" || type === "street") {
            document.getElementById("googleMapsLink").classList.remove("hidden");
        }
    });
});
