class DrawingCanvasService {

    constructor() {
        //Liste de tracés
        this.records = [];
    }

    startRecord(x,y,color) {
        this.points = []; //Liste de points, que l'on vide/initialise
        this.points.push({x:x,y:y}); //Puis on y rajoute les coordonnées passées en paramètre
        this.color = color;
    }

    record(x,y) {
        this.points.push({x:x,y:y}); //On ajoute les coordonnées à la liste de coordonnées du tracé en cours
    }

    stopRecord() {
        //On ajoute le tracé courant dans la liste de tracé avec sa couleurs et ses points
        this.records.push({points : this.points, color: this.color});
    }

    clearRecord() {
        this.records.splice(-1,1); //On supprime le dernier élément du tableau de tracés
    }

    clearAll() {
        this.records = []; //On vide la liste de tracés
    }

    getRecords() {
        return this.records;
    }
}