// Your code here
document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/characters")
        .then(response => response.json()) 
        .then(data => displayData(data))
        .catch(error => console.error("Error fetching pups:", error)); 
});
function displayData(characters) {
    const characterBar = document.getElementById("character-bar");
    characterBar.innerHTML = ""; // Clear previous content

    characters.forEach(character => {
        const name = document.createElement("span");
        name.textContent = character.name;
        name.dataset.id = character.id; // Store pup's ID
        characterBar.appendChild(name);

        // Add event listener to each span
        name.addEventListener("click", function () {
            displayInfo(character); // Pass the clicked dog's data
        });
    });
}