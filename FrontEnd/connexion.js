const bonEmail = "steevy72500@gmail.com"
const bonMotDePasse = "motdepasse"

const formulaireConnexion = document.getElementById("formulaire-connexion");

formulaireConnexion.addEventListener("submit", (event) => {
    event.preventDefault()
    
    const email = event.target.querySelector("[name=email-connexion]").value;

    const motDePasse = event.target.querySelector("[name=mot-de-passe-connexion]").value;

    console.log(email)
    console.log(motDePasse)
    
    if (motDePasse === bonMotDePasse && email === bonEmail) {
        console.log("gggg")
        window.location = "./index.html"
    }
    else {
        console.log("erreur : mauvais identifiants")
    }
    
})



