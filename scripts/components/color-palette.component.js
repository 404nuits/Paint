class ColorPaletteComponent {

    constructor(element, colors, onColorChanged) {
        //HTML de la palette
        this.element = element;

        //CouleurItems de la palette
        this.colors = colors || [];

        // Callback utilisée par ColorPaletteComponent quand la couleur change pour notifier le système
        this.onColorChanged = onColorChanged;

        this.colorService = new ColorService();
    }


    /**
     * setOnColorChanged, méthode utilisée pour mettre à jour la callback à utiliser en cas de changement de couleur
     * callback: Function
     * */
    setOnColorChanged(callback) {
        this.onColorChanged = callback;
    }

    /**
     * init, méthode utilisée par le système pour initialiser le composant
     * */
    init() {
        //Après avoir récupéré les couleurs de manière asynchrone, on les render
        this.getColorsAsync().then(() => {
            this.render();
        });
    }


    /**
     * getColorsAsync, méthode utilisée pour récupérer l'ensemble des couleurs qui seront utilisés lors de l'affichage
     * */
    async getColorsAsync() {
        //On récupère les couleurs à partir du Service, puis on les attribue à la variable
        await this.colorService.getColors().then((colorsList) => {
            this.colors = colorsList;
        });
        // utiliser la méthode "getColors" de this.colorService pour récupérer les données de couleurs
    }

    render() {
        // on efface le contenu HTML
        this.element.innerHTML = "";

        //On bind this (l'instance de ColorPalette) à la fonction handleSelectedColor afin de pouvoir désélectionner les autres colorItem lors de son callback
        let handleSelectedColorBinded = this.handleSelectedColor.bind(this);

        //On parcours la liste de colorItems pour les afficher
        this.colors.forEach((color) => {
            
            //Pour chaque couleur, on créé un color item component en passant le ColorItem et la fonction de callback en paramètre
            let colorComponent = new ColorItemComponent(color,handleSelectedColorBinded);
            
            //Puis on render ce ColorItemComponent (retourne un élément HTML)
            let div_child = colorComponent.render();
            
            //Et enfin, on insère l'élément HTML dans le container de la palette
            this.element.appendChild(div_child);

            //Si la couleur est sélectionnée, on exécute la fonction de callback pour envoyer le colorItem au système
            if (color.selected) {
                this.onColorChanged(color);
            }
        })
    }

    /**
     * handleSelectedColor, méthode appelé lorsque qu'un ColorItemComponent effectue un "onSelected"
     * colorItem: ColorItem sélectionné
     * */
    handleSelectedColor(colorItem) {

        //Comme il ne doit y avoir qu'un seul élément sélectionné, on désélectionne tous les colorItem
        this.colors.forEach(colorItem => {
            this.colorService.setUnselected(colorItem);
        });

        //Puis on sélectionne celui concerné
        this.colorService.setSelected(colorItem);

        //Enfin, on regénère le rendu()
        this.render();

        //Enfin, on exécute la fonction de callback pour envoyer le colorItem au système
        this.onColorChanged(colorItem);

    }
}