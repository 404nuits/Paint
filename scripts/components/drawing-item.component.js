class DrawingItemComponent {
    
    constructor(drawingItem, onSelected) {
        this.drawingItem = drawingItem;

        // Callback utilisée par ColorItemComponent quand la couleur est sélectionnée pour notifier DrawingListComponent du changement
        this.onSelected = onSelected;
    }

    /**
     * render, méthode utilisée pour créer le rendu HTML du composant.
     * Ajouter un évènement de click sur l'élément
     * */
     render() {
        //Création de l'élément HTML
        let element = document.createElement('img');

        //Ajout de l'auteur dans le titre de l'élément HTML
        element.title = this.drawingItem.author;

        //Ajout du base64 dans l'élément HTML
        element.src = this.drawingItem.content;

        //Ajout de la classe drawing-item
        element.classList.add('drawing-item');

        //Ajout de l'évènement au clic sur l'élément
        element.addEventListener('click', () => this.handleClick());

        return element;
    }

    /**
     * handleClick, méthode utilisée au clique sur l'élément pour notifier ColorPaletteComponent
     * */
    handleClick() {
        // utilisation de la callback this.onSelected
        this.onSelected(this.drawingItem);
    }


}