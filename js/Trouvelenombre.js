document.addEventListener('DOMContentLoaded', function () {
    var nombreAleatoire;
    var essaisUtiliser;
    var sec, min, hrs;
    var chronoElement;
    var t;
    
    // Fonction pour initialiser le jeu
    function initGame() {
        nombreAleatoire = Math.floor(Math.random() * 100) + 1;
        console.log("Nombre à deviner : " + nombreAleatoire); // Pour débogage
        essaisUtiliser = 0;
        sec = 0;
        min = 0;
        hrs = 0;
        chronoElement = document.getElementById('chrono');
        chronoElement.textContent = '00:00:00';
        console.log("Jeu initialisé.");
    }

    // Fonction pour mettre à jour le chronomètre
    function updateChrono() {
        sec++;
        if (sec >= 60) {
            sec = 0;
            min++;
            if (min >= 60) {
                min = 0;
                hrs++;
            }
        }
        chronoElement.textContent = (hrs > 9 ? hrs : '0' + hrs) + ':' +
                                    (min > 9 ? min : '0' + min) + ':' +
                                    (sec > 9 ? sec : '0' + sec);
        console.log("Chrono mis à jour : " + chronoElement.textContent); // Pour débogage
    }

    // Fonction asynchrone pour jouer le jeu
    async function playGame() {
    // Démarrer le chronomètre dès le début du jeu
    t = setInterval(updateChrono, 1000);
    console.log("Chronomètre démarré."); // Pour débogage

    while (true) {
        var machaine = prompt("Entrez un nombre entre 1 et 100.");
        if (machaine === null) {
            alert("Vous avez abandonné la partie.");
            clearInterval(t);
            console.log("Jeu arrêté."); // Pour débogage
            return; // Terminer la boucle et la fonction si l'utilisateur annule
        } else if (machaine === "") {
            alert("Veuillez entrer un nombre pour jouer.");
            continue; // Revenir au début de la boucle pour permettre à l'utilisateur de réessayer
        }

        // Vérification si l'entrée contient des lettres ou n'est pas un nombre valide
        var monNombre = parseInt(machaine);
        if (isNaN(monNombre) || monNombre < 1 || monNombre > 100 || !Number.isInteger(monNombre)) {
            alert("Veuillez entrer un nombre entier valide entre 1 et 100 !");
            continue; // Revenir au début de la boucle pour permettre à l'utilisateur de réessayer
        }

        essaisUtiliser++;

        if (monNombre === nombreAleatoire) {
            alert("Bravo, tu as réussi à trouver le nombre en " + essaisUtiliser + " essais !");
            clearInterval(t); // Arrêter le chronomètre
            console.log("Nombre trouvé. Jeu terminé."); // Pour débogage
            freezeGame();
        } else if (monNombre < nombreAleatoire) {
            alert("Plus grand !");
        } else if (monNombre > nombreAleatoire) {
            alert("Plus petit !");
        }

        // Attente pour permettre à l'interface utilisateur de se mettre à jour
        await new Promise(resolve => setTimeout(resolve, 0));
    }
}


    // Événement lorsqu'on clique sur le bouton "Cliquez ici"
    document.getElementById('bigButton').addEventListener('click', function() {
        console.log("Bouton 'Cliquez ici' cliqué."); // Pour débogage
        initGame(); // Initialiser le jeu
        t = setInterval(updateChrono, 1000); // Démarrer le chronomètre
        console.log("Chronomètre démarré."); // Pour débogage
        playGame(); // Démarrer le jeu
        console.log("Jeu démarré."); // Pour débogage
    });
});

