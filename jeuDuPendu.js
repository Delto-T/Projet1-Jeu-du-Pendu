
//Fonctions

function initialisationTouchAlphabet () {
    alphabet.forEach( lettre => {
        let nouvelleLettre = document.createElement('div');
        nouvelleLettre.innerHTML = `<div class='craie'>${lettre}</div>`;
        grilleAlphabet.append(nouvelleLettre);
    });
};

function initialisationMotATrouver () {
    [...motADeviner].map( () => {
        let nouvelleLettre = document.createElement('span');
        nouvelleLettre.innerHTML = `
        <span class="lettreADecouvrir">
        <span class="lettreTrouvee">X</span>
        <img src="./img/trait_1.png" alt="trait à la craie">
        </span>`;
        document.querySelector('#motADecouvrir').append(nouvelleLettre);
    });
  }

//Variable
let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","v","x","y","z"]
let motADeviner = "caroline";
let motTrouve;

console.log(motTrouve);

// Génération du DOM
let grilleAlphabet = document.querySelector('#craiesContainer');


initialisationTouchAlphabet();
initialisationMotATrouver();