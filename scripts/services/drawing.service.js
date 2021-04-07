class DrawingService {
    constructor() {
        this.drawingRepository = new DrawingRepository();
    }
    
    getDrawings() {

        //Liste de drawingItem
        let drawingsList = [];

        //On récupère les drawings sous la forme d'un tableau (JSON.parse)
        let drawings = JSON.parse(this.drawingRepository.findAll());

        //S'il y a des drawings dans le tableau récupéré, on parcours ce dernier et pour chaque drawing, on créé son DrawingItem et on le push dans la drawingsList
        if (drawings) {
            drawings.forEach((drawing) => {

                let drawingItem = new DrawingItem(drawing.author, drawing.content);
    
                drawingsList.push(drawingItem);
    
            });
        }

        return drawingsList;
    }

    postDrawing(author,drawing) {
        //On créé un objet avec l'auteur et le contenu (la base64 de l'image)
        let body = {
            "author": author,
            "content": drawing
        };

        //Puis on post ce dernier
        this.drawingRepository.post(body);
    }

    clearDrawings() {
        this.drawingRepository.clear();
    }
}