function DrawCanvas(timeSpan) {
    DrawMaze();

    for (var figureIndex = 0; figureIndex < game.level.allFigures.length; figureIndex++) {
        DrawFigure(game.level.allFigures[figureIndex], game.level.viewPort, timeSpan);
    }

    DrawInstrumentLayer();
    DrawToWindow();
}

function DrawMaze() {
    //tools.log('gameMazeImage:'+gameMazeImage);
    doubleBufferCanvasContext.drawImage(game.level.gameMazeImage, game.level.viewPort.x, game.level.viewPort.y, game.level.viewPort.width, game.level.viewPort.height, 0, 0, windowWidth, windowHeight);
}

function DrawInstrumentLayer() {

    if (instrumentLayerImage == null) {
        instrumentLayerImage = document.createElement("canvas");
        instrumentLayerImage.width = windowWidth;
        instrumentLayerImage.height = windowHeight;
        instrumentLayerImageContext = instrumentLayerImage.getContext("2d");
    }

    if (lastFigureEnergy != game.level.humanFigure.energy) {
        if (lastFigureEnergy == null) {
            instrumentLayerImageContext.fillStyle = "#FF0000";
            instrumentLayerImageContext.strokeStyle = "#000000";
        }
        lastFigureEnergy = game.level.humanFigure.energy;
        instrumentLayerImageContext.clearRect(windowWidth - 150, 0, 104, 50);
        instrumentLayerImageContext.fillRect(windowWidth - 148, 22, lastFigureEnergy, 10);
        instrumentLayerImageContext.strokeRect(windowWidth - 150, 20, 104, 14);
    }

    doubleBufferCanvasContext.drawImage(instrumentLayerImage, 0, 0);
}

function DrawToWindow() {
    canvasContext.drawImage(doubleBufferCanvas, 0, 0);
}

function StartImageLoading() {
    imageCount = 3;

    dungeonImage = new Image();
    dungeonImage.onload = OnImageLoaded;
    dungeonImage.src = 'images/dungeon3.png';

    activeImage = new Image();
    activeImage.onload = OnImageLoaded;
    activeImage.src = 'images/aktive.png';

    passiveImage = new Image();
    passiveImage.onload = OnImageLoaded;
    passiveImage.src = 'images/passive.png';
}


function DrawFigure(currentFigure, viewPort, timeSpan) {
    //tools.log('DrawFigure currentFigure');
    //tools.log(currentFigure);
    if (currentFigure != null)
    {
        var animationIndex = 0;
        if (currentFigure.speed != 0) {
            currentFigure.animationStartTimeStamp += timeSpan;
            animationIndex = Math.floor(currentFigure.animationStartTimeStamp / 100) % 8;
        }
        var spriteIndex = 0;
        if (currentFigure.orientation.x > 0) {
            spriteIndex = 24;
        }
        if (currentFigure.orientation.x < 0) {
            spriteIndex = 8;
        }
        if (currentFigure.orientation.y > 0) {
            spriteIndex = 16;
        }
        spriteIndex += currentFigure.imageIndex * 4 * 8 + animationIndex;
        var spriteY = Math.floor(spriteIndex / 8);
        var spriteX = spriteIndex % 8;

        if ((Math.floor(currentFigure.bulletproofCountdown / 100)) % 3 < 2) {
            doubleBufferCanvasContext.drawImage(currentFigure.image, 50 * spriteX, 50 * spriteY, 50, 50, currentFigure.location.x - viewPort.x, currentFigure.location.y - viewPort.y, 50, 50);
        }
    }
}

function OnImageLoaded() {
    imageCount--;
    if (imageCount === 0) {
        var size = 2;
        var width = 16 * size;
        var height = 12 * size;


        doubleBufferCanvas = document.createElement("canvas");
        doubleBufferCanvas.width = windowWidth;
        doubleBufferCanvas.height = windowHeight;
        doubleBufferCanvasContext = doubleBufferCanvas.getContext("2d");

        game = new Game();
        game.gameLoop(null);
    }
}

var game = null;
//var lastTimeStamp = 0;
var counter = 0;
var start = 0;
var instrumentLayerImage = null;
var lastFigureEnergy = null;
var imageCount = 3;
var dungeonImage = null;
var activeImage = null;
var passiveImage = null;
var doubleBufferCanvas = null;
var doubleBufferCanvasContext = null;
var instrumentLayerImageContext = null;
var mazeSpriteIndexes = [];
var windowWidth = 0;
var windowHeight = 0;
var canvasContext = null;

function Start() {
    //Set image indexes for the maze
    mazeSpriteIndexes = new Array(16);
    mazeSpriteIndexes[0] = 20;
    mazeSpriteIndexes[1] = 30;
    mazeSpriteIndexes[2] = 32;
    mazeSpriteIndexes[3] = 31;
    mazeSpriteIndexes[4] = 25;
    mazeSpriteIndexes[5] = 26;
    mazeSpriteIndexes[6] = 21;
    mazeSpriteIndexes[7] = 29;
    mazeSpriteIndexes[8] = 33;
    mazeSpriteIndexes[9] = 28;
    mazeSpriteIndexes[10] = 22;
    mazeSpriteIndexes[11] = 24;
    mazeSpriteIndexes[12] = 23;
    mazeSpriteIndexes[13] = 19;
    mazeSpriteIndexes[14] = 34;
    mazeSpriteIndexes[15] = 27;

    var canvas = document.getElementById("lunte-canvas");

    windowWidth = canvas.width;
    windowHeight = canvas.height;

    canvasContext = canvas.getContext("2d");

    window.requestAnimFrame = GetRequestAnimFrameFunction();

    StartImageLoading();
}

function GetRequestAnimFrameFunction() {
    //These part copied from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/:
    // shim layer with setTimeout fallback
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
    };
}

$(document).ready(function() {
    Start();
});
