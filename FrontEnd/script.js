async function app() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    afficherTravaux(travaux);
    afficherElementsFiltres(travaux)
}

app()

/* Galerie */ 

const galerie = document.querySelector(".galerie");

function afficherTravaux(travaux) {

    for(const travail of travaux) {
        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = travail.imageUrl;
        image.alt = travail.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = travail.title

        figure.appendChild(image);
        figure.appendChild(figcaption)
        galerie.appendChild(figure);
    }
}

/* Boutons Filtres */

const boutons = document.querySelectorAll(".filtres button");

boutons[0].classList.add("active");

function afficherElementsFiltres(travaux) {

    for(const bouton of boutons) {
        bouton.addEventListener("click", () => {
            if(bouton.value === "0") {
                galerie.innerHTML = "";
                afficherTravaux(travaux);
            }
            else {
                const travauxFiltres = travaux.filter(function (travail) {
                    return travail.categoryId === parseInt(bouton.value);
                })
                galerie.innerHTML = "";
                afficherTravaux(travauxFiltres);
            }

            boutons.forEach((bouton) => {
                bouton.classList.remove("active");
            });
            bouton.classList.add("active");
            
        })
    }
}

/* Compte Editeur */

const token = window.localStorage.getItem("token");
console.log("Token : " + token);

const boutonConnexion = document.querySelector(".btn-connexion a")
const modeEdition = document.querySelector(".mode-edition");
const buttonEdition = document.querySelector(".modifier");

if(token) {
    boutonConnexion.href = "";
    boutonConnexion.innerText = "logout";
    modeEdition.style.display = "flex";
    buttonEdition.style.display = "block";

    boutonConnexion.addEventListener("click", () => {
        window.localStorage.removeItem("token");
    })
}

if(!token) {
    boutonConnexion.href = "./connexion.html";
    boutonConnexion.innerText = "login";
    modeEdition.style.display = "none";
    buttonEdition.style.display = "none";
}

/* Modale */

const conteneurModale = document.querySelector(".conteneur-modale");
const fermer = document.querySelector(".modale i");

buttonEdition.addEventListener("click", () => {
    conteneurModale.style.display = "block";
})

fermer.addEventListener("click", () => {
    conteneurModale.style.display = "none";
})

window.addEventListener("click", (event) => {
    if (event.target === conteneurModale) {
      conteneurModale.style.display = "none";
    }
  });
