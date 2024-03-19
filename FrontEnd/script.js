async function app() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    afficherTravaux(travaux);
    initialisationFiltres(travaux)
    afficherTravauxModale(travaux);
    soumissionFormulaireAjoutPhoto(travaux)
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
        /* Ajouter une catégorie "tous" */
        id: 0,
        name: "Tous"
    });

    for(const categorie of categories) {

        /* Création et initialisation des boutons de filtration*/
        const filtre = document.createElement("button");
        filtre.dataset.id = categorie.id;
        if(categorie.id === 0) {
            filtre.classList.add("active");
        }
        filtre.innerText = categorie.name;
        filtres.appendChild(filtre);

        /* Filtration */
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

/* Modale page suppression */

const conteneurModale = document.querySelector(".conteneur-modale");
const fermer = document.querySelectorAll("#fermer");

buttonEdition.addEventListener("click", () => {
    conteneurModale.style.display = "block";
})

for(const buttonFermer of fermer) {
    buttonFermer.addEventListener("click", () => {
        conteneurModale.style.display = "none";
    })
}

window.addEventListener("click", (event) => {
    if (event.target === conteneurModale) {
      conteneurModale.style.display = "none";
    }
});

/* modale page ajout*/ 

const buttonAjouterPhoto = document.querySelector(".ajouter-photo");
const modaleProjet = document.querySelector(".modale-projet");
const modaleAjout = document.querySelector(".modale-ajout")
const retour = document.getElementById("retour");

buttonAjouterPhoto.addEventListener("click", () => {
    modaleProjet.style.display = "none";
    modaleAjout.style.display = "flex";
})

retour.addEventListener("click", () => {
    modaleProjet.style.display = "flex";
    modaleAjout.style.display = "none";
})

/* Afficher Travaux */

const galerieModale = document.querySelector(".galerie-modale");

function afficherTravauxModale(travaux) {  
    /* permet de nettoyer la galerie si il y a des éléments pour préparer un nouvelle affichage */
    if(galerieModale.children.length){
        galerieModale.innerHTML = "";
    }
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

        ajouterEcouteurSupprimer(travail, travaux, supprimer);
    }
}

/* Suppression projet */

function ajouterEcouteurSupprimer(travail, travaux, supprimer) {
    supprimer.addEventListener("click", async () => {
        
        const reponse = await fetch(`http://localhost:5678/api/works/${travail.id}`,
            {   method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`
                } 
            }  
        )  
        /* Si l'Api a bien supprimer l'image alors on retire l'image des travaux puis on affiche dynamiquement */
        if(reponse.status === 204) {
            travaux = travaux.filter((projet)=> {
                return projet.id !== travail.id;
            }) 
            afficherTravauxModale(travaux)
        }
    })
}

/* Ajouter projet */

const formulaireAjoutPhoto = document.querySelector(".modale-ajout form");
const photo = document.getElementById("ajouter-photo");
const titre = document.getElementById("titre");
const categorie = document.getElementById("categorie");
const boutonValider = document.getElementById("valider");
boutonValider.disabled = true;

const conteneurAjouterPhoto = document.querySelector(".conteneur-ajouter-photo");
const logoAjouterPhoto = document.querySelector(".conteneur-ajouter-photo i");
const labelAjouterPhoto = document.querySelector(".conteneur-ajouter-photo label");
const texteAjouterPhoto = document.querySelector(".conteneur-ajouter-photo p");

photo.addEventListener("change", (event) => {

    verificationTailleFichier()

    const fichier = event.target.files[0];

    if(fichier) {
        let imageElement = document.getElementById("image-projet");
        if(!imageElement) {
            imageElement = document.createElement("img");
            imageElement.id = "image-projet";
            conteneurAjouterPhoto.appendChild(imageElement);
        }
    
        const imageUrl = URL.createObjectURL(fichier)
        imageElement.src = imageUrl;

        logoAjouterPhoto.style.display = "none";
        labelAjouterPhoto.style.display = "none";
        texteAjouterPhoto.style.display = "none";
    }
})

function verificationTailleFichier() {
    const fichier = photo.files[0];
    if (fichier && fichier.size > 4 * 1024 * 1024) { /* 4mo en octets */
        alert("La taille du fichier ne doit pas dépasser 4 Mo.");
        /* Réinitialiser la valeur de l'input file pour effacer le fichier sélectionné */
        photo.value = '';
    }
}

function verificationChampRemplis() {
    return photo.value.trim() !== "" && titre.value.trim() !== "" && categorie.value.trim() !== "";
}

/* Fonction d'activation du bouton valider */
function activerBoutonValider() {
    if (verificationChampRemplis()) {
        boutonValider.classList.add("active");
        boutonValider.disabled = false;
    } else {
        boutonValider.classList.remove("active");
        boutonValider.disabled = true;
    }
}

/* Contrôle dynamique des inputs du formulaire */
photo.addEventListener("change", activerBoutonValider);
titre.addEventListener("input", activerBoutonValider);
categorie.addEventListener("change", activerBoutonValider);
window.addEventListener("load", activerBoutonValider);

function soumissionFormulaireAjoutPhoto(travaux) {

    formulaireAjoutPhoto.addEventListener("submit", async (event) => {
        event.preventDefault();

        /* Réinitialisation de la zone ajout image */
        const imageElement = document.getElementById("image-projet");
        if(!imageElement) {
            return;
        }
        logoAjouterPhoto.style.display = "block";
        labelAjouterPhoto.style.display = "block";
        texteAjouterPhoto.style.display = "block";
        conteneurAjouterPhoto.removeChild(imageElement);
        
        /* Création du FormData + récupération des catégories de l'API*/
        const formData = new FormData(formulaireAjoutPhoto);
        const reponse = await fetch("http://localhost:5678/api/categories");
        const categoriesApi = await reponse.json();
    
        /* Modification de la première lettre de la catégorie en majuscule pour tester avec les catégories de l'API */
        const categorieValue = categorie.value;
        const categorieModifiee = categorieValue.charAt(0).toUpperCase() + categorieValue.slice(1);
    
        for(const categorieApi of categoriesApi) {
            if(categorieModifiee === categorieApi.name) {
                formData.set("category", categorieApi.id);
                break;  
            }
        }

        const fichier = document.getElementById("ajouter-photo").files[0];
        formData.append("image", fichier);
    
        try {
            const reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const projet = await reponse.json()
            /* Si l'Api a bien ajouter l'image alors on ajoute le projet à la liste et on affiche dynamiquement */
            if(reponse.status === 201) {

                travaux.push(projet);
                afficherTravauxModale(travaux)
              
                /* retour sur la page de suppression après ajout*/
                modaleProjet.style.display = "flex";
                modaleAjout.style.display = "none";
            }
        } catch (error) {
            console.log("Erreur lors de l'envoie du formulaire vers l'API")
        }
    });
}