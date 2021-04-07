class ColorService {
    constructor() {
        this.colorRepository = new ColorRepository();
    }

    async getColors() {

        //Liste de ColorItem
        let colorsList = [];

        //On récupère la liste de colors
        let response = await this.colorRepository.findAll();

        //Après avoir récupéré la liste de couleurs, on créé les ColorItem puis on les push dans la colorsList
        response.colors.forEach((color,index) => {
            //On sélectionne automatique la première couleur de la liste
            let one_color;
            if (index == 0) {
                one_color = new ColorItem(color["color"], true);
            } else {
                one_color = new ColorItem(color["color"], false);
            }

            colorsList.push(one_color);

        });
        return colorsList;
    }

    setSelected(colorItem) {
        //Met l'attribut selected d'un colorItem à true
        colorItem.selected = true;
    }

    setUnselected(colorItem) {
        //Met l'attribut selected d'un colorItem à false
        colorItem.selected = false;
    }
}