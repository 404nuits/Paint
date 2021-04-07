class PaintComponent {

    constructor(element, drawingCanvas, colorPalette, drawingList) {
        this.element = element;
        this.drawingCanvas = drawingCanvas;
        this.colorPalette = colorPalette;
        this.drawingList = drawingList;

        this.drawingService = new DrawingService();
    }

    /**
     * init, méthode utilisée par le système pour initialiser le composant.
     * Cette méthode doit aussi modifier les callbacks des composants ColorPaletteComponent et DrawingListComponent pour bien être notifié en cas de changement
     * */
    init() {
        this.getButtonsEl();
        this.initEvents();
        //On bind l'élément this pour pouvoir utiliser d'autres méthodes/attributs de la classe PaintComponent lors du callback
        this.colorPalette.setOnColorChanged(this.handleColorChanged.bind(this));
        this.drawingList.setOnDrawingChanged(this.handleDrawingChanged.bind(this));
    }


    /**
     * getButtonsEl, méthode utilisée pour récupérer tous les éléments HTML boutons (action-refresh, reset-button, undo-button, send-button)
     * */
    getButtonsEl() {
        //Ajout de l'élément action_clear en plus pour nettoyer le localStorage
        this.action_clear = document.querySelector('.action-clear');

        this.action_refresh = document.querySelector('.action-refresh');
        
        this.reset_button = document.querySelector('#reset-button');
        
        this.undo_button = document.querySelector('#undo-button');
        
        this.send_button = document.querySelector('#send-button');
    }

    /**
     * initEvents, méthode utilisée pour initialiser les évènements sur les éléments boutons
     * */
    initEvents() {

        this.action_clear.addEventListener('click', () => {
            this.drawingList.clearDrawings();
            this.drawingList.init();
        });
        
        this.action_refresh.addEventListener('click', () => {
            //On recharge la liste de dessins (re-récupérer les dessins depuis le lieu de stockage + les render)
            this.drawingList.init();
        });

        this.reset_button.addEventListener('click',() => this.drawingCanvas.clearAll());

        this.undo_button.addEventListener('click', () => this.drawingCanvas.undo());

        this.send_button.addEventListener('click', () => {
            
            //Fenêtre de demande du nom de l'artiste à l'utilisateur
            let author = prompt("S'il vous plaît, veuillez renseigner l'auteur du dessin","Pablo Picasso");

            if (author != null) {
                //Récupération du dessin
                let drawing = this.drawingCanvas.getDataURL();

                //Envoi du dessin avec l'auteur à drawingService
                this.drawingService.postDrawing(author,drawing);

                //Puis on recharge la liste de dessins
                this.drawingList.init();
            }
        });
        
    }

    /**
     * handleColorChanged, méthode appelé lorsque ColorPaletteComponent effectue un "onColorChanged"
     * colorItem: ColorItem sélectionné
     * */
    handleColorChanged(colorItem) {
        // il faut notifier this.drawingCanvas pour qu'il puisse utiliser la nouvelle couleur
        this.drawingCanvas.setColor(colorItem);
    }


    /**
     * handleDrawingChanged, méthode appelé lorsque DrawingListComponent effectue un "onDrawingChanged"
     * drawingItem: DrawingItem sélectionné
     * */
    handleDrawingChanged(drawingItem) {
        // il faut notifier this.drawingCanvas pour qu'il puisse afficher le dessin en fond
        this.drawingCanvas.setBackground(drawingItem);
    }
}