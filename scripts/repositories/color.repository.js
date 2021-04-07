class ColorRepository {

    constructor(){}

    async findAll(){

        //ajouter le mot clé async devant la fonction findAll() si on veut utiliser le code commenté ci dessous
        try {
            //On récupère la réponse
            let response = await fetch("./data/colors.json");
            //Puis on la retourne en JSON
            return await response.json();

        } catch(error){
            error => alert("Erreur : " + error);
        } 
    }
}