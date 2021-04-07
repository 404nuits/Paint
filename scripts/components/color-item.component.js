class ColorItemComponent {

    constructor(colorItem, onSelected) {
        this.colorItem = colorItem;

        // Callback utilisée par ColorItemComponent quand la couleur est sélectionnée pour notifier ColorPaletteComponent du changement
        this.onSelected = onSelected;
    }

    /**
     * render, méthode utilisée pour créer le rendu HTML du composant.
     * Vérifier si la couleur est sélectionné pour lui attribut ou non la classe CSS "selected"
     * Ajouter un évènement de click sur l'élément
     * Ajuster la couleur de fond de l'élément en fonction de la couleur
     * */
    render() {
        //Création de l'élément HTML
        let element = document.createElement('div');

        //Ajout de la classe color-item
        element.classList.add('color-item');
        
        //Si l'attribut selected est à "true", ajout de la classe .selected sur l'élément
        if (this.colorItem.selected) {
            element.classList.add('selected');
        }

        //Ajout de la couleur adéquate en background
        element.style.backgroundColor = this.colorItem.color;

        //Ajout de l'évènement au clic sur l'élément
        element.addEventListener('click', () => this.handleClick());

        return element;
    }

    /**
     * handleClick, méthode utilisée au clique sur l'élément pour notifier ColorPaletteComponent
     * */
    handleClick() {
        // utilisation de la callback this.onSelected
        this.onSelected(this.colorItem);
    }


}