let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  const toyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener("submit", submitNewToy);
  fetchLostToys();
});

async function fetchLostToys() {
  const resp = await fetch("http://localhost:3000/toys");
  const data = await resp.json();
  data.forEach((e) => {
    renderToy(e);
  });
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.classList.add("card");

  const h2 = document.createElement("h2");
  h2.innerText = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.classList.add("toy-avatar");

  const pElement = document.createElement("p");
  pElement.innerText = `${toy.likes} Likes`;

  const button = document.createElement("button");
  button.classList.add("like-btn");
  button.id = toy.id;
  button.innerText = "Like ❤️";

  button.addEventListener("click", (e) => {
    incrementLike(toy, pElement);
  });

  card.append(h2, img, pElement, button);
  toyCollection.append(card);
}

async function incrementLike(toy, pTag) {
  toy.likes += 1;

  try {
    const response = await fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: toy.likes }),
    });

    if (!response.ok) throw new Error(response.status);
    console.log("response from patch: ", response);
    // update the likes in the DOM
    pTag.innerText = `${toy.likes} Likes`;
  } catch (error) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "ERROR: " + error.message;
    errorMessage.style.color = "red";
    document.body.appendChild(errorMessage);
  }
}

async function submitNewToy(e) {
  e.preventDefault();

  let newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0,
  };

  try {
    const response = await fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    });

    if (!response.ok) throw new Error(response.status);

    const toyData = await response.json();

    // add the new toy to the DOM
    renderToy(toyData);
  } catch (error) {
    alert("ERROR! ", error.message);
  }
}
