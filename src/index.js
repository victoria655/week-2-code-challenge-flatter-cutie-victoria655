document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/characters")
        .then(response => response.json()) 
        .then(data => displayData(data))
        .catch(error => console.error("Error fetching characters:", error)); 
});

function displayData(characters) {
    const characterBar = document.getElementById("character-bar");
    characterBar.innerHTML = ""; // Clear previous content

    characters.forEach(character => {
        const name = document.createElement("span");
        name.textContent = character.name;
        name.dataset.id = character.id; // Store character's ID
        characterBar.appendChild(name);

        // Add event listener to each character
        name.addEventListener("click", function () {
            fetchCharacterData(character.id); // Fetch the latest data before displaying
        });
    });
}

// Fetch the latest character data from db.json before displaying
function fetchCharacterData(characterId) {
    fetch(`http://localhost:3000/characters/${characterId}`)
        .then(response => response.json())
        .then(character => displayInfo(character))
        .catch(error => console.error("Error fetching character:", error));
}

function displayInfo(character) {
    const details = document.getElementById("detailed-info");
    const charactername = document.getElementById("name");
    const characterimage = document.getElementById("image");
    const charactervotes = document.getElementById("vote-count");

    charactername.textContent = character.name;
    characterimage.src = character.image;
    charactervotes.textContent = character.votes; // Display the latest vote count

    // Save current character ID for vote updates
    details.dataset.currentCharacterId = character.id;
}

document.addEventListener("DOMContentLoaded", () => {
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const voteCount = document.getElementById("vote-count");
    
    let currentVotes = 0;
    
    function updateVotes(event) {
        event.preventDefault();
        const votesInput = document.getElementById("votes").value;
        const votesToAdd = parseInt(votesInput, 10);
        const characterId = document.getElementById("detailed-info").dataset.currentCharacterId;

        if (!isNaN(votesToAdd) && votesToAdd > 0 && characterId) {
            currentVotes += votesToAdd;
            voteCount.textContent = currentVotes;

            // Send PATCH request to update votes in db.json
            fetch(`http://localhost:3000/characters/${characterId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: currentVotes }),
            })
            .then(response => response.json())
            .then(updatedCharacter => {
                console.log("Votes updated:", updatedCharacter);
            })
            .catch(error => console.error("Error updating votes:", error));

            document.getElementById("votes").value = ""; // Clear input field
        }
    }

    function resetVotes() {
        const characterId = document.getElementById("detailed-info").dataset.currentCharacterId;
        currentVotes = 0;
        voteCount.textContent = currentVotes;

        if (characterId) {
            // Send PATCH request to reset votes in db.json
            fetch(`http://localhost:3000/characters/${characterId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 }),
            })
            .then(response => response.json())
            .then(updatedCharacter => {
                console.log("Votes reset:", updatedCharacter);
            })
            .catch(error => console.error("Error resetting votes:", error));
        }
    }

    voteForm.addEventListener("submit", updateVotes);
    resetButton.addEventListener("click", resetVotes);
});

document.addEventListener("DOMContentLoaded", () => {
    const characterForm = document.getElementById("character-form");
    const characterBar = document.getElementById("character-bar");

    characterForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        const name = document.getElementById("character-name").value;
        const image = document.getElementById("image-url").value;

        const newCharacter = { name: name, image: image, votes: 0 };

        fetch("http://localhost:3000/characters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Character added:", data);
            alert("New character added successfully!");

            const nameSpan = document.createElement("span");
            nameSpan.textContent = data.name;
            nameSpan.dataset.id = data.id;
            characterBar.appendChild(nameSpan);

            nameSpan.addEventListener("click", function () {
                fetchCharacterData(data.id); // Ensure new character fetches latest data
            });

            characterForm.reset();
        })
        .catch((error) => console.error("Error adding character:", error));
    });
});
