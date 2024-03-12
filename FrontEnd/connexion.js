const formulaireConnexion = document.getElementById("formulaire-connexion");

formulaireConnexion.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const identifiants = {
        email: event.target.querySelector("[name=email-connexion]").value,
        password: event.target.querySelector("[name=mot-de-passe-connexion]").value
    };

    const chargeUtile = JSON.stringify(identifiants);

    console.log("Envoi de la requête avec les données suivantes :", identifiants);

    try {
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        if (!reponse.ok) {
            throw new Error("Erreur lors de la requête");
        }

        const data = await reponse.json();
        console.log("Réponse reçue :", data);
        
        window.localStorage.setItem("token", data.token);
        window.location = "./index.html";
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
});