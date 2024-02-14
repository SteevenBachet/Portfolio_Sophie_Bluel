async function app() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    afficherTravaux(travaux);
    afficherElementsFiltres(travaux)
}

app()

const galerie = document.querySelector(".gallery");

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

afficherElementsFiltres = (travaux) => {

    const boutons = document.querySelectorAll(".filtres button");

    for(let bouton of boutons) {
        bouton.addEventListener("click", () => {
            if(bouton.value === "0") {
                galerie.innerHTML = ""
                afficherTravaux(travaux)
            }
            else {
                const travauxFiltres = travaux.filter(function (travail) {
                    return travail.categoryId === parseInt(bouton.value);
                })
                galerie.innerHTML = ""
                afficherTravaux(travauxFiltres)
            }

            /* Couleur des boutons */ 

            boutons.forEach((bouton) => {
                bouton.classList.remove("active");
            });
            bouton.classList.add("active");
            
        })
    }

}
















