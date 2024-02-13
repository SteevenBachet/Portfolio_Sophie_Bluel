console.log("yoyo")

async function app() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const travaux = await reponse.json();
    afficherTravaux(travaux);
}

function afficherTravaux(travaux) {

    const galerie = document.querySelector(".gallery");
    
    for(const travail of travaux) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = travail.imageUrl;
        image.alt = travail.title;


        /* créer le figcaption */
        figure.appendChild(image);
        galerie.appendChild(figure);
        
        console.log(travail);
    }

    debugger
}








app()