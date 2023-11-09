

const urlApiMotAleatoire = "https://trouve-mot.fr/api/sizemax/10/5";
//Fonctions

function initialisationTouchAlphabet () {
    alphabet.forEach( lettre => {
        let nouvelleLettre = document.createElement('div');
        nouvelleLettre.innerHTML = `<div class='craie' name="${lettre}">${lettre}</div>`;
        grilleAlphabet.append(nouvelleLettre);
    });
};

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
                console.log(mot.name)
                return mot.name;
            }
        }
        
    };

};

function afficherLettre(tableauIndex){
    console.log(tableauIndex);
    tableauIndex.forEach(index => {
        document.querySelector(`#lettre_${index.toString()}`).textContent = motADeviner[index];
        document.querySelector(`#lettre_${index.toString()}`).style.visibility = "visible";
        motAAfficher[index] = motADeviner[index];
    });
};

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


function finDujJeu (resultat) { 
    // Désactiver toute les touches
    document.querySelectorAll('.craie').forEach( craieElement => craieElement.className = "craie craieDisable" );
    // faire Clignoter en 0 et 7 la potence
    // Bouton rejouer à la place de la potence
    afficherButtonRestart();
    if(resultat === "perdu"){
        initialisationMotAAfficher("PERDU", true);
    }else if (resultat === "gagner"){
        initialisationMotAAfficher("GAGNER", true);
    };

 };

function gestionDesViesEtDeLaPotence() { 
        ++phasePendu
        // console.log(phasePendu);
        if(phasePendu < 7){
            document.querySelector("#potence").setAttribute('src',`./img/pendu_${phasePendu}.png`);       
        }else{
            document.querySelector("#potence").setAttribute('src',`./img/pendu_${phasePendu}.png`);  
            finDujJeu("perdu");
        };
 };


function verifierLettre (lettreAVerifier){
    let lettreEnConcordance = [];
    let motADevinerTableau =[...motADeviner] 

    for(let i=0; i < motADevinerTableau.length; i++){
        if(lettreAVerifier.target.textContent === motADevinerTableau[i]){
            lettreEnConcordance.push(i);
            lettreAVerifier.target.className = "craie craieTrouvee";
        }
    };



    if(lettreEnConcordance.length === 0){
        lettreAVerifier.target.className = "craie craieDisable";
        gestionDesViesEtDeLaPotence();
    }else{
        afficherLettre(lettreEnConcordance);
    };

};

function verifierGagner () {
    if(!motAAfficher.includes("=")){
        finDujJeu("gagner")
    }
};

//Variable
let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","v","x","y","z"]
let motADeviner;
let motAAfficher = [];
let grilleAlphabet = document.querySelector('#craiesContainer');
let phasePendu = 0;




// Génération du DOM
recupererMot().then(motGenere => {
    motADeviner = motGenere;
    [...motGenere].forEach( () => motAAfficher.push("=") );
    initialisationMotAAfficher(motAAfficher);
});
initialisationTouchAlphabet();


// Listener
let lettreAlphabet = document.querySelectorAll(".craie");
lettreAlphabet.forEach(lettre => {
    lettre.addEventListener('click',(e) => verifierLettre(e));
    lettre.addEventListener('click', verifierGagner);
});
