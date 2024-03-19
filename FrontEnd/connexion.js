const formulaireConnexion = document.getElementById("formulaire-connexion");

formulaireConnexion.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput = event.target.querySelector("[name=email-connexion]");
    const passwordInput = event.target.querySelector("[name=mot-de-passe-connexion]");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const identifiants = { email, password };
    const chargeUtile = JSON.stringify(identifiants);

    console.log("Envoi de la requête avec les données suivantes :", identifiants);

    try {
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        if (!reponse.ok) {
            alert("Mot de passe incorrect.");
            emailInput.value = "";
            passwordInput.value = "";
            return;
        }

        const data = await reponse.json();
        console.log("Réponse reçue :", data);
        
        window.localStorage.setItem("token", data.token);
        window.location = "./index.html";
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
});