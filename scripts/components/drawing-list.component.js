class DrawingListComponent {
    constructor(element, onBackgroundChanged) {
        this.element = element;
        this.onBackgroundChanged = onBackgroundChanged;
        this.drawingService = new DrawingService();
        this.drawings = []; //Liste de DrawingItem
    }

    /**
     * setOnBackgroundChanged, méthode utilisée pour mettre à jour la callback à utiliser en cas de changement de background
     * callback: Function
     * */
     setOnDrawingChanged(callback) {
        this.onBackgroundChanged = callback;
    }

    /**
     * init, méthode utilisée par le système pour initialiser le composant
     * */
    init() {
        //Récupérer les drawings de leur endroit de stockage
        this.getDrawings();

        //Les "render"
        this.render();
    }

    /**
     * getDrawings, méthode utilisée pour récupérer l'ensemble des backgrounds qui seront utilisés lors de l'affichage (la méthode n'est plus asynchrone en raison de l'utilisation de l'API localStorage, qui est synchrone)
     * */
     getDrawings() {
        this.drawings = this.drawingService.getDrawings();
    }

    render() {
        // on efface le contenu HTML
        this.element.innerHTML = "";

        //On bind this (l'instance de DrawingListComponent) à la fonction handleSelectedDrawing
        let handleSelectedDrawingBinded = this.handleSelectedDrawing.bind(this);

        //On parcours la liste de drawings pour les afficher
        this.drawings.forEach((drawing) => {
            
            //Pour chaque drawing, on créé un drawing item component en passant le DrawingItem et la fonction de callback en paramètre
            let drawingComponent = new DrawingItemComponent(drawing,handleSelectedDrawingBinded);
            
            //Puis on render ce DrawingItemComponent (retourne un élément HTML)
            let img_child = drawingComponent.render();
            
            //Et enfin, on insère l'élément HTML dans le container de la liste de drawings
            this.element.appendChild(img_child);
        })
    }

    /**
     * handleSelectedDrawing, méthode appelé lorsque qu'un DrawingItemComponent effectue un "onSelected"
     * drawingItem: DrawingItem sélectionné
     * */
    handleSelectedDrawing(drawingItem) {
        //On exécute la fonction de callback pour envoyer le drawingItem au système
        this.onBackgroundChanged(drawingItem);
    }

    clearDrawings() {
        this.drawingService.clearDrawings();
    }
}