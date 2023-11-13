

// url de l'api pour récuperer un mot aléatoire.
const urlApiMotAleatoire = "https://trouve-mot.fr/api/sizemax/10/5";

//Fonctions

//Fonction permettant d'initialiset le clavier à cliquer lors de l'initialisation de la page
function initialisationTouchAlphabet () {
    alphabet.forEach( lettre => {
        let nouvelleLettre = document.createElement('div');
        nouvelleLettre.innerHTML = `<div class='craie' name="${lettre}">${lettre}</div>`;
        grilleAlphabet.append(nouvelleLettre);
    });
};

// Fonction permettant d'initialiser les tirets à la place des lettres du mot à deviner. Cette fonction sert aussi a afficher Perdu ou Gagner à la fin du jeu
function initialisationMotAAfficher (motAAfficher , finDuJeu = false) {
    let indexSpanDesLettre = 0;

    if(finDuJeu){
        document.querySelectorAll('.lettreADecouvrir').forEach( element => element.remove());
    }

    [...motAAfficher].forEach( lettre => {
        let nouvelleLettre = document.createElement('span');
        nouvelleLettre.innerHTML = `
        <span class="lettreADecouvrir">
            <span class="${finDuJeu ? "lettreTrouveeVisible" : "lettreTrouvee"}" id="lettre_${finDuJeu ? indexSpanDesLettre * 100 : indexSpanDesLettre.toString()}">${lettre}</span>
            <img src="./img/trait_1.png" alt="trait à la craie">
        </span>`;

        document.querySelector('#motADecouvrir').append(nouvelleLettre);
        indexSpanDesLettre++;
    });

};

// Requete sur une API servant à récupérer 5 mot entre 2 et 10 lettre,  le premier des cinq mots sans caractère spéciale sera retenue
async function recupererMot() {

    const requeteRecupererCinqMots = await fetch(urlApiMotAleatoire,{method:'GET'});

    if(!requeteRecupererCinqMots.ok){
        alert("Une erreur s'est produite veuillez recharger la page.")
    }else{
        let cinqMotAleatoire = await requeteRecupererCinqMots.json();
        const regex = /[ý,þ,ÿ,À,Á,Â,Ã,Ä,Å,Æ,Ç,È,É,Ê,Ë,Ì,Í,Î,Ï,Ð,Ñ,Ò,Ó,Ô,Õ,Ö,Ø,Ù,Ú,Û,Ü,Ý,Þ,ß,à,á,â,ã,ä,å,æ,ç,Ë,Ì,Ü,Ý,Þ,Í,è,é,ê,ë,ì,í,î,ï,ð,ñ,ò,ó,ô,õ,ö,ø,ù,ú,û,ü,ý,ë,î,ï,ð,Ë,Ì,Í]/g;
        
        for(mot of cinqMotAleatoire){
            let found = mot.name.match(regex);

            if(found === null){
                return mot.name;
            }
        }
        
    };

};

// Fonction servant à afficher les lettres du mot à trouver
function afficherLettre(tableauIndex){

    tableauIndex.forEach(index => {
        document.querySelector(`#lettre_${index.toString()}`).textContent = motADeviner[index];
        document.querySelector(`#lettre_${index.toString()}`).style.visibility = "visible";
        motAAfficher[index] = motADeviner[index];
    });
};

// Fonction servant à afficher le bouton restart lorsque la partie est finie
function afficherButtonRestart() { 
    document.querySelector('#potence').remove()
    document.querySelector("#tableauContainer").style.gap = "45px";
    let rejouerElement = document.createElement('a');
    rejouerElement.id = "rejouer";
    rejouerElement.href = "./index.html";
    rejouerElement.innerHTML = `
        <p>Rejouer ?</p>
        <img src="./img/flecheRejouerOk.png" alt="potence blanche sans pendu" id="potence">`;
    document.querySelector("#tableauContainer").insertBefore(rejouerElement,document.querySelector('#motADecouvrir'));
};


// Fonction permettant de gérer la fin du jeu en fonction si c'est gagné ou perdu
function finDujJeu (resultat) { 
    // Désactiver toute les lettres à cliquer pour l'utilisateur
    document.querySelectorAll('.craie').forEach( craieElement => craieElement.className = "craie craieDisable" );

    //Retire le bouton Mot trouvé
    document.querySelector('#buttonSolution').remove();

    // Bouton rejouer à la place de la potence
    afficherButtonRestart();
    if(resultat === "perdu"){
        initialisationMotAAfficher("PERDU", true);
    }else if (resultat === "gagner"){
        initialisationMotAAfficher("GAGNE", true);
    };
 };

// Fonction permettant de gérer l'affichage de la potence mais aussi de déclancher la fin du jeu "perdu"
function gestionDesViesEtDeLaPotence() { 
        ++phasePendu;
        if(phasePendu < 7){
            document.querySelector("#potence").setAttribute('src',`./img/pendu_${phasePendu}.png`);       
        }else{
            document.querySelector("#potence").setAttribute('src',`./img/pendu_${phasePendu}.png`);  
            finDujJeu("perdu");
        };
 };


 // Fonction permettant de vérifier la lettre cliqué avec les lettres du mots à trouver.
function verifierLettre (lettreAVerifier){
    let lettreEnConcordance = [];
    let motADevinerTableau =[...motADeviner] 

    // Permet de récupérer l'indice des lettres du mot à trouver en correspondant avec la lettre cliquée
    for(let i=0; i < motADevinerTableau.length; i++){
        if(lettreAVerifier.target.textContent === motADevinerTableau[i]){
            lettreEnConcordance.push(i);
            lettreAVerifier.target.className = "craie craieTrouvee";
        };
    };

    if(lettreEnConcordance.length === 0){
        lettreAVerifier.target.className = "craie craieDisable";
        gestionDesViesEtDeLaPotence();
    }else{
        afficherLettre(lettreEnConcordance);
    };

};


// Permet de savoir si la partie est fini avec le sénario Gagné
function verifierGagner () {
    if(!motAAfficher.includes("=")){
        finDujJeu("gagner");
    };
};

function proposerMotAValidation() { 
    // A coder
    // Recoit un mot si c'est le bon finDuJeu => Gagner sinon finDuJeu = PERDU
 };


function verifierMotProposerHandler () {
    if(confirm("Etes vous sûr de tenter le tout pour le tout ? \n Si votreproposition n'est pas la bonne vous aurez perdu.")){
        let propositionUser = prompt("Veuillez rentrer le mot auquel vous pensez ?")

        if(propositionUser === motADeviner){
            finDujJeu("gagner");
        }else{
            finDujJeu("perdu");
        };
    };
}



//Variables
let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
let motADeviner;
let motAAfficher = [];
let grilleAlphabet = document.querySelector('#craiesContainer');
let phasePendu = 0;




// Génération du DOM suite à la récupération du mot à deviner
recupererMot().then(motGenere => {
    motADeviner = motGenere;
    // console.log(motADeviner);
    [...motGenere].forEach( () => motAAfficher.push("=") );
    initialisationMotAAfficher(motAAfficher);
});
initialisationTouchAlphabet();


// Listener
let lettreAlphabetHandler = document.querySelectorAll(".craie");
lettreAlphabetHandler.forEach(lettre => {
    lettre.addEventListener('click',(e) => verifierLettre(e));
    lettre.addEventListener('click', verifierGagner);
});

document.querySelector('#buttonSolution').addEventListener('click',verifierMotProposerHandler);