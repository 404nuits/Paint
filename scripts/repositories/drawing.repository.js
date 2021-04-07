class DrawingRepository {

    constructor(base_url) {
        this.base_url = base_url;
    }

    findAll() {
        //localStorage étant une API synchrone, nous ne faisons pas de Promise
        return localStorage.getItem('drawings');
    }

    //En raison de l'absence de réponse du serveur, nous enregistrons nos dessins dans LocalStorage
    post(body) {
        //Récupération de la liste de dessins stockés dans le localStorage
        let drawings = JSON.parse(localStorage.getItem("drawings"));
        
        //Si les drawings n'existent pas, on créé un tableau vide de drawings
        if (!drawings) {
            drawings = [];
        }

        //On rajoute dans la liste notre nouveau dessin
        drawings.push(body);

        //On stringify la nouvelle liste
        let drawings_json = JSON.stringify(drawings);
        
        //Puis on la met dans localStorage
        localStorage.setItem("drawings", drawings_json);
    }

    clear() {
        localStorage.removeItem("drawings");
    }
}