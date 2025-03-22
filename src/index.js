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


function displayInfo(character) {
    const details = document.getElementById("detailed-info");
    const charactername = document.getElementById("name");
    charactername.innerHTML = ""; // Clear previous content
    const characterimage = document.getElementById("image");
    characterimage.innerHTML = "";
    const charactervotes = document.getElementById("vote-count");
    charactervotes.innerHTML = ""; 

    charactername.textContent = character.name;
    characterimage.src = character.image;
    charactervotes.textContent=character.votes
    
   details.appendChild(charactername);
    details.appendChild(characterimage);
}
 
document.addEventListener("DOMContentLoaded", () => {
    const voteForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const voteCount = document.getElementById("vote-count");
    
    let currentVotes = 0;
    
    // Function to update the votes
    function updateVotes(event) {
      event.preventDefault();
      const votesInput = document.getElementById("votes").value;
      const votesToAdd = parseInt(votesInput, 10);
      
      if (!isNaN(votesToAdd) && votesToAdd > 0) {
        currentVotes += votesToAdd;
        voteCount.textContent = currentVotes;
        document.getElementById("votes").value = ""; //ensures after submission the input field is clear
      }
    }
  
    // Function to reset votes
    function resetVotes() {
      currentVotes = 0;
      voteCount.textContent = currentVotes;
    }
  
    voteForm.addEventListener("submit", updateVotes);
    resetButton.addEventListener("click", resetVotes);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const characterForm = document.getElementById("character-form");
    const characterBar = document.getElementById("character-bar");
  
    characterForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevents page refresh
  
      // Get form input values
      const name = document.getElementById("character-name").value;
      const image = document.getElementById("image-url").value;
  
      // Create a new character object
      const newCharacter = {
        
        name: name,
        image: image,
        votes: 0, // Default votes
      };
  
      // Send a POST request to db.json
      fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCharacter) // Convert to JSON string
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Character added:", data);
          alert("New character added successfully!");
  
          // ✅ Dynamically add the new character to the character bar
          const nameSpan = document.createElement("span");
          nameSpan.textContent = data.name;
          nameSpan.dataset.id = data.id; // Store character ID
          characterBar.appendChild(nameSpan);
  
          // ✅ Add event listener to the new character so it can be displayed when clicked
          nameSpan.addEventListener("click", function () {
            displayInfo(data); // Show the new character's details
          });
  
          // Clear form after submission
          characterForm.reset();
        })
        .catch((error) => console.error("Error adding character:", error));
    });
  });
  