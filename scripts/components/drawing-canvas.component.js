class DrawingCanvasComponent {

    constructor(element, color, size) {
        this.element = element;
        this.ctx = null;
        this.inDrawing = false;
        //Si la couleur est nulle, celle par défaut sera la couleur noire
        this.color = color || new ColorItem("black",false);
        this.size = size || 2;
        this.currentBackground = null;
        
        this.drawingCanvasService = new DrawingCanvasService();
    }


    /**
     * init, méthode utilisée par le système pour initialiser le composant
     *  Récupérer le "context" du canvas
     *  Initialise les évènements de type "mouse" sur le canvas
     * */
     init() {

        // Récupérer le contexte du canvas pour pouvoir le manipuler
        this.ctx = this.element.getContext("2d"); 

        //Initialisation de la taille
        this.ctx.lineWidth = this.size;

        //Initialisation de la forme du curseur
        this.ctx.lineCap = "round";

        //Initialisation de la couleur du tracé (à noir si aucune couleur de la palette est sélectionnée)
        this.setColor(this.color);

        //Initialisation les évènements de type "mouse" sur le canvas
        this.initMouseEvents();
    }

    /**
     * setColor, méthode mise à disposition pour mettre à jour la couleur à utiliser lors des prochains tracés
     * color: ColorItem sélectionnée
     * 
     * return void
     * */
    setColor(color) {
        //On met le ColorItem dans this.colors
        this.color = color;
        //On change la couleur du tracé en récupérant l'attribut color du ColorItem
        this.ctx.strokeStyle = color.color;
    }
    
    /**
     * setBackground, méthode mise à disposition pour un drawingItem en fond du canvas
     * drawingItem: DrawingItem sélectionné
     * 
     * return void
     * */
    setBackground(drawingItem) {
        this.clearAll();
        this.currentBackground = drawingItem;
        this.drawBackground(drawingItem.content);
    }


    /**
     * drawBackground, méthode utilisée pour dessiner une image sur le canvas
     * image: base64 
     * 
     * return void
     * */
    drawBackground(image) {
        //Création d'un objet image
        let base_image = new Image();

        //Ajout de l'image en base64 à l'objet Image
        base_image.src = image;

        base_image.onload = () => {
            this.ctx.drawImage(base_image, 0, 0, this.element.width, this.element.height);

            //S'il y a des records d'enregistré, on les redessine après avoir positionné le background
            //(Avant, j'exécutais la méthode redraw après la méthode drawBackground, mais les records se dessinaient AVANT la fin du chargement de l'image, ce qui résultait en un background appraissant au dessus des lignes)
            if(this.drawingCanvasService.getRecords().length !== 0) {
                this.redraw();
            }
        };
    }

    /**
     * getDataURL, méthode mise à disposition pour récupérer la base64 du canvas
     * 
     * return base64
     * */
    getDataURL() {
        //Converti le canva en base64
        let dataURL = this.element.toDataURL();
        return dataURL;
    }

    ////////////////////////////////

    /**
     * initMouseEvents, méthode utilisé pour placer l'ensemble des évènements de type clique sur le canvas.
     *  Gérer le changement d'état (en cours dessin ou non)
     *  Enregistrement l'ensemble des points par tracé avec la couleur utilisé
     *  Démarrer/arrêter le chemin de tracé sur le canvas
     * */
    initMouseEvents() {
        this.element.addEventListener('mousedown', (evt) => {
            const { offsetX, offsetY } = evt;

            //On récupère les coordonnées X et Y en tant que dernière position connue
            this.lastXpos = offsetX;
            this.lastYpos = offsetY;

            //On commence un record avec ces coordonnées
            this.drawingCanvasService.startRecord(offsetX,offsetY,this.color);

            //On est en train de dessiner
            this.inDrawing = true;

        });
        this.element.addEventListener('mousemove', (evt) => {
            const { offsetX, offsetY } = evt;

            //Si la souris bouge et que l'on est en mode dessin, 
            if(this.inDrawing) {
                //On continue le record
                this.drawingCanvasService.record(offsetX,offsetY);
                //On dessine sur le canvas
                this.draw(offsetX, offsetY);
            }

        });
        this.element.addEventListener('mouseup', (evt) => {
            //Si on arrête de cliquer sur la souris, on arrête le record
            this.drawingCanvasService.stopRecord();
            
            this.closePath();

        });
        this.element.addEventListener('mouseleave', (evt) => {
            if(this.inDrawing) {

                this.drawingCanvasService.stopRecord();
                this.closePath();
                
            }
        });
    }

    /**
     * closePath, méthode utilisé pour signaler au canvas la fin du chemin de notre tracé
     *  change l'état du composant pour signaler qu'on est plus en cours de dessin
     *  stoper l'enregistrement de l'ensemble des points de notre tracé
     * 
     * return void
     * */
    closePath() {
        //Fin du tracé avec l'API du canva
        this.ctx.closePath();
        
        //Changement d'état
        this.inDrawing = false;
    }


    /**
     * draw, méthode utilisé pour dessiner une line depuis notre dernier point jusqu'à la coordonnée (x,y) du canvas
     * 
     * */
    draw(x,y) {
        //On commence le tracé
        this.ctx.beginPath();

        //Puis on trace une ligne des derniers x et y connus aux x et y actuels
        this.ctx.moveTo(this.lastXpos, this.lastYpos);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();

        //On change la dernière position de x et y à celles passées en paramètre de la méthode
        this.lastXpos = x;
        this.lastYpos = y;
    }

    /**
     * redraw, méthode utilisée pour redessiner la liste de records du drawingCanvasService
     */
    redraw() {
        //On sauvegarde la couleur avant le redraw pour ensuite la réinjecter dans this.color après l'opération
        let current_color = this.color;

        //On récupère la liste des records (tracés) contenue dans DrawingCanvasService
        let records = this.drawingCanvasService.getRecords();

        //On parcours cette liste pour retracer chaque record
        records.forEach((record) => {

            this.setColor(record.color);

            //On défini les derniers x et y connus aux premiers points du record, afin que lors du redraw, une ligne 
            //Ne soit pas tracée entre les records
            this.lastXpos = record.points[0].x;
            this.lastYpos = record.points[0].y;

            record.points.forEach(point => {
                this.draw(point.x, point.y);
            });

        });

        //On met la couleur active à celle sélectionnée avant de retracer tous les records
        this.setColor(current_color);
    }


    ////////////////////////////////

    /**
     * clearAll, méthode mise à disposition pour réinitialiser la zone de dessin
     *  Effacer le canvas
     *  Supprimer le background par default
     *  Supprimer l'historique de dessin
     * 
     * */
    clearAll() {
        this.clear();

        this.drawingCanvasService.clearAll();

        this.currentBackground = null;


    }

    /**
     * clear, méthode utilisé pour réinitialiser la zone de dessin
     *  Effacer le canvas
     * 
     * */
    clear() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }

    /**
     * undo, méthode utilisé pour effacer le dernier tracé
     * 
     * */
    undo() {
        //D'abord, on enlève le record de la liste des records
        this.drawingCanvasService.clearRecord();
        //Ensuite, on réinitialise la zone de dessin
        this.clear();
        
        
        //Si lil n'y avait pas de background, on exécute uniquement la méhode redraw, sinon, on exécute drawBackground, qui contient redraw
        if (this.currentBackground === null) {
            this.redraw();
        } else {
            this.drawBackground(this.currentBackground.content);
        }
    }
}