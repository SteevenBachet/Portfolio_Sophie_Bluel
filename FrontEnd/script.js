async function app() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    afficherTravaux(travaux);
    initialisationFiltres(travaux)
    afficherTravauxModale(travaux);
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

const filtres = document.querySelector(".filtres");

async function initialisationFiltres(travaux) {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    categories.unshift({
        id: 0,
        name: "Tous"
    });

    for(const categorie of categories) {

        const filtre = document.createElement("button");
        filtre.dataset.id = categorie.id;

        if(categorie.id === 0) {
            filtre.classList.add("active");
        }

        filtre.innerText = categorie.name;
        filtres.appendChild(filtre);

        filtre.addEventListener("click", () => {
            if(filtre.dataset.id === "0") {
                galerie.innerHTML = "";
                afficherTravaux(travaux);
            }
            else {
                const travauxFiltres = travaux.filter(function (travail) {
                    return travail.categoryId === parseInt(filtre.dataset.id);
                })
                galerie.innerHTML = "";
                afficherTravaux(travauxFiltres);
            }

            /* Couleurs des boutons */

            const tousLesBoutons = document.querySelectorAll(".filtres button")

            tousLesBoutons.forEach((filtre) => {
                filtre.classList.remove("active");
            });
            filtre.classList.add("active");
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


/* pas de rafraichis de page quand on ajoute un work */

/* LiveServer rafraichis automatiquement (attention) */

const galerieModale = document.querySelector(".galerie-modale");


function afficherTravauxModale(travaux) {
    for(const travail of travaux) {
        const figure = document.createElement("figure");

        const image = document.createElement("img");
        image.src = travail.imageUrl;
        image.alt = travail.title;

        const supprimer = document.createElement("div");
        const corbeille = document.createElement("i");
        corbeille.classList.add("fa-solid", "fa-trash-can");

        supprimer.appendChild(corbeille);
        figure.appendChild(supprimer);
        figure.appendChild(image);
        galerieModale.appendChild(figure);

        ajouterEcouteurSupprimer(travail, supprimer);
    }

}

function ajouterEcouteurSupprimer(travail, supprimer) {
    supprimer.addEventListener("click", async () => {
        
        await fetch(`http://localhost:5678/api/works/${travail.id}`,
            {   method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`
                } 
            }  
        )  
    })
}
