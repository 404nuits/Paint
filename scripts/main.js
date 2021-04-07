function main(){
    const colorPaletteEl = document.querySelector('.color-palette'); // Récupération de l'élément <div class="color-palette">
    const colorPalette = new ColorPaletteComponent(colorPaletteEl);
    colorPalette.init();

    const canvasEl = document.querySelector('.canvas'); // Récupération de l'élément <canvas class="canvas" width="500" height="500">
    const drawingCanvas = new DrawingCanvasComponent(canvasEl);
    drawingCanvas.init();

    const drawingListEl = document.querySelector('.drawing-container'); // Récupération de l'élément <div class="drawing-container">
    const drawingList = new DrawingListComponent(drawingListEl);
    drawingList.init();

    const paintEl = document.querySelector('.paint-container'); // Récupération de l'élément <div class="paint-container">
    const paint = new PaintComponent(paintEl, drawingCanvas, colorPalette, drawingList);
    paint.init();
}

main();