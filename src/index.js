let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
const toyCollection = document.getElementById("toy-collection");
const toyForm = document.querySelector("form.add-toy-form");

// Helper to create toy card element
function createToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";

  const h2 = document.createElement("h2");
  h2.textContent = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";

  const p = document.createElement("p");
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement("button");
  button.className = "like-btn";
  button.id = toy.id;
  button.textContent = "Like ❤️";

  // Add event listener for like button
  button.addEventListener("click", () => {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((resp) => resp.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes; // update local toy object
        p.textContent = `${updatedToy.likes} Likes`; // update DOM
      })
      .catch((error) => console.error("Error updating likes:", error));
  });

  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(button);

  return card;
}

// Fetch toys and render on page load
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((toys) => {
      toys.forEach((toy) => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching toys:", error));
}

// Handle new toy form submit
toyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = toyForm.querySelector('input[name="name"]');
  const imageInput = toyForm.querySelector('input[name="image"]');

  const newToy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0,
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((resp) => resp.json())
    .then((createdToy) => {
      const card = createToyCard(createdToy);
      toyCollection.appendChild(card);

      // Reset form fields
      nameInput.value = "";
      imageInput.value = "";
    })
    .catch((error) => console.error("Error adding toy:", error));
});

// Call fetchToys on page load
document.addEventListener("DOMContentLoaded", fetchToys);
