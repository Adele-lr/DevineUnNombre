function quitterPartie() {
    clearInformationArea();
    informationArea.value = "Vous venez de quitter la partie.";

    // Cache les autres éléments
    propositionInput.classList.add('d-none');
    soumettreButton.classList.add('d-none');
    abandonnerButton.classList.add('d-none');
    chrono.classList.add('d-none');
    leNombre.classList.add('d-none');
    rejouerButton.classList.add('d-none');
    tableChronosPerso.classList.add('d-none');
    propositionInput.classList.add('d-none')


    stopChronometer();
    // Afficher le message pendant 3 secondes, puis réinitialiser le jeu
    setTimeout(() => {
        resetGame();
    }, 2000);
}	
function clearInformationArea() {
    informationArea.value = ""; 
}
function resetGame() {
    // Arrêter le chronomètre actif
    stopChronometer();

    // Cache les éléments de jeu
    propositionInput.classList.add('d-none');
    soumettreButton.classList.add('d-none');
    abandonnerButton.classList.add('d-none');
    chrono.classList.add('d-none');
    leNombre.classList.add('d-none');
    rejouerButton.classList.add('d-none');
    tableChronosPerso.classList.add('d-none');
    propositionInput.classList.add('d-none')
    
    // Réinitialise le tableau des meilleurs temps
    meilleursTemps = [];
    reponsesDonnees = [];

    // Affiche le bouton "Lancer le jeu"
    lancerButton.classList.remove('d-none');

    // Réinitialise les autres éléments si nécessaire
    propositionInput.value = '';
    leNombre.textContent = '';
    clearInformationArea();
    sec = 0;
    min = 0;
    hrs = 0;

    // Réinitialise l'intervalle pour éviter les problèmes de vitesse accrue
    clearInterval(t);
    chronoElement.textContent = '00:00:00';
}

function freezeGame() {
    propositionInput.disabled = true;
    soumettreButton.disabled = true;
    stopChronometer();
    leNombre.classList.add('disabled');
}
function initGame() {
    // Arrêter le chronomètre actif s'il y en a un
    stopChronometer();
    reponsesDonnees = [];
    // Réinitialiser les variables de jeu
    propositionInput.value = '';
    clearInformationArea();
    nombreAleatoire = Math.floor(Math.random() * 100) + 1;
    console.log("Nombre à deviner : " + nombreAleatoire); // Pour débogage
    essaisUtiliser = 0;
    sec = 0;
    min = 0;
    hrs = 0;

    // Affichage initial du chronomètre à '00:00:00'
    chronoElement = document.getElementById('chrono');
    chronoElement.textContent = '00:00:00';

    // Message indiquant que le jeu commence
    informationArea.value = 'Le jeu commence !\n';

    // Démarrer le chronomètre pour le nouveau jeu
    startChronometer();

    // Activer les boutons et cacher le bouton "Rejouer"
    propositionInput.disabled = false;
    soumettreButton.disabled = false;
    abandonnerButton.classList.remove('d-none');
    leNombre.classList.remove('d-none');
}
function evaluerProposition() {
    clearInformationArea();
    var machaine = document.getElementById('proposition').value;
    if (machaine === "") {
        informationArea.value += "Veuillez entrer un nombre pour jouer.\n";
        propositionInput.value = '';
        return;
    }

    console.log("Valeur lue: " + machaine);
    var monNombre = parseInt(machaine);
    if (isNaN(monNombre) || monNombre < 1 || monNombre > 100 || !Number.isInteger(monNombre)) {
        informationArea.value += "Veuillez entrer un nombre entier valide entre 1 et 100 !\n";
        propositionInput.value = '';
        return;
    }
    if (reponsesDonnees.includes(monNombre)) {
        informationArea.value += "Vous avez déjà donné cette réponse.\n";
        propositionInput.value = '';
        return;
    }

    // Ajouter la réponse à la liste des réponses données
    reponsesDonnees.push(monNombre);
    essaisUtiliser++;

    if (monNombre === nombreAleatoire) {
        if (essaisUtiliser === 1) {
            informationArea.value += "Bravo, tu as réussi à trouver le nombre du premier coup !\n";
        } else {
            informationArea.value += "Bravo, tu as réussi à trouver le nombre en " + essaisUtiliser + " essais !\n";
        }
        console.log("Nombre trouvé. Jeu terminé.");
        rejouerButton.classList.remove('d-none'); // Affiche le bouton "Rejouer"
        freezeGame();
        stopChronometer(); // Arrêter le chronomètre

        // Enregistrer le temps de jeu actuel
        tempsJeu = chronoElement.textContent;

        // Enregistrer le temps dans les meilleurs temps
        meilleursTemps.push(tempsJeu);

        // Trier les meilleurs temps du plus petit au plus grand
        meilleursTemps.sort((a, b) => {
            return tempsEnSecondes(a) - tempsEnSecondes(b);
        });

        // Mettre à jour le tableau des meilleurs temps dans le HTML
        updateBestTimesTable();
    } else if (monNombre < nombreAleatoire) {
        informationArea.value += "Plus grand !\n";
        propositionInput.value = '';
    } else if (monNombre > nombreAleatoire) {
        informationArea.value += "Plus petit !\n";
        propositionInput.value = '';
    }
}

function startChronometer() {
    sec = 0, min = 0, hrs = 0;
    t = setInterval(updateChrono, 1000);
}

function stopChronometer() {
    clearInterval(t);
}
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
}

function checkEnter(event) {
    if (event.keyCode === 13) {
        evaluerProposition();
    }
}
function updateBestTimesTable() {
    var tableChronosPerso = document.getElementById('tableChronosPerso');
    if (tableChronosPerso) {
        var tbody = tableChronosPerso.querySelector('tbody');
        var rows = tbody.getElementsByTagName('tr');
        
        // Limiter à 10 meilleurs temps
        var topTenTimes = meilleursTemps.slice(0, 10);

        // Mettre à jour ou créer les lignes nécessaires
        for (var i = 0; i < topTenTimes.length; i++) {
            var temps = topTenTimes[i];
            var row = rows[i];
            if (!row) {
                row = tbody.insertRow(i);
                var positionCell = row.insertCell(0);
                var chronoCell = row.insertCell(1);
                positionCell.textContent = i + 1; // Assigner la position
                chronoCell.textContent = temps; // Assigner le temps du chrono
            } else {
                var positionCell = row.cells[0];
                var chronoCell = row.cells[1];
                positionCell.textContent = i + 1; // Assigner la position
                chronoCell.textContent = temps; // Assigner le temps du chrono
            }
        }
    }
}
function tempsEnSecondes(temps) {
    var tempsSplit = temps.split(':');
    var heures = parseInt(tempsSplit[0], 10);
    var minutes = parseInt(tempsSplit[1], 10);
    var secondes = parseInt(tempsSplit[2], 10);
    return heures * 3600 + minutes * 60 + secondes;
}
