'use strict';

function ViewPort(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
}

function GameLoop(timeStamp) {
    var timeSpan = timeStamp - lastTimeStamp;
    timeSpan = Math.min(timeSpan, constants.maximumAnimationTimeSpan); //To avoid greate jumps.
    lastTimeStamp = timeStamp;

    for (var figureIndex = 0; figureIndex < allFigures.length; figureIndex++) {
        var currentFigure = allFigures[figureIndex];
        currentFigure.move(timeSpan);
        if (humanFigure.bulletproofCountdown == 0 && currentFigure.isCollided(humanFigure)) {
            humanFigure.bulletproofCountdown = constants.bulletproofTimeSpan;
            humanFigure.energy = Math.max(0, humanFigure.energy - constants.defaultEnergyCollisionDecrease);
        }
    }

    CorrectViewPort();
    DrawCanvas(timeSpan);

    if (humanFigure.energy <= 0) {
        alert("You are death");
        return;
    }

    if (Math.floor((humanFigure.location.x + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == gameMaze.endCellColumn && Math.floor((humanFigure.location.y + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == gameMaze.endCellRow) {
        alert("Exit achieved");
        return;
    }
    /*     if (start == 0)
     {
       start = timeStamp;
     }
     counter++;
     if ((timeStamp - start) > 10000)
     {
       var fps = counter / 10;
       alert(fps);
     }
     else*/
    {
        window.requestAnimFrame(GameLoop);
    }
}

function DrawCanvas(timeSpan) {
    gameMaze.draw(doubleBufferCanvasContext, viewPort);

    for (var figureIndex = 0; figureIndex < allFigures.length; figureIndex++) {
        allFigures[figureIndex].draw(doubleBufferCanvasContext, viewPort);
    }

    DrawInstrumentLayer();
    DrawToWindow();
}


function DrawInstrumentLayer() {

    if (instrumentLayerImage == null) {
        instrumentLayerImage = document.createElement("canvas");
        instrumentLayerImage.width = windowWidth;
        instrumentLayerImage.height = windowHeight;
        instrumentLayerImageContext = instrumentLayerImage.getContext("2d");
    }

    if (lastFigureEnergy != humanFigure.energy) {
        if (lastFigureEnergy == null) {
            instrumentLayerImageContext.fillStyle = "#FF0000";
            instrumentLayerImageContext.strokeStyle = "#000000";
        }
        lastFigureEnergy = humanFigure.energy;
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
    dungeonImage.src = "images/dungeon3.png"

    activeImage = new Image();
    activeImage.onload = OnImageLoaded;
    activeImage.src = "images/aktive.png";

    passiveImage = new Image();
    passiveImage.onload = OnImageLoaded;
    passiveImage.src = "images/passive.png";
}


function CorrectViewPort() {
    var width = gameMaze.width;
    var height = gameMaze.height;

    var currentFigure = humanFigure;

    if (currentFigure.location.x - viewPort.x > windowWidth - 150) {
        viewPort.x = currentFigure.location.x - windowWidth + 150;
    }
    if (currentFigure.location.x - viewPort.x < 100) {
        viewPort.x = currentFigure.location.x - 100;
    }
    if (currentFigure.location.y - viewPort.y > windowHeight - 150) {
        viewPort.y = currentFigure.location.y - windowHeight + 150;
    }
    if (currentFigure.location.y - viewPort.y < 100) {
        viewPort.y = currentFigure.location.y - 100;
    }

    if (viewPort.x + windowWidth > width * 50) {
        viewPort.x = width * 50 - windowWidth;
    }
    if (viewPort.x < 0) {
        viewPort.x = 0;
    }
    if (viewPort.y + windowHeight > height * 50) {
        viewPort.y = height * 50 - windowHeight;
    }
    if (viewPort.y < 0) {
        viewPort.y = 0;
    }
}

function OnImageLoaded() {
    imageCount--;
    if (imageCount == 0) {
        var size = 2;
        var width = 16 * size;
        var height = 12 * size;

        viewPort = new ViewPort(windowWidth, windowHeight);

        allFigures = new Array();

        humanFigure = new Figure(activeImage, 1);
        humanFigure.location.x = 50;
        humanFigure.location.y = 50;
        allFigures.push(humanFigure);

        gameMaze = new Maze(width, height, dungeonImage);

        var enemyFigures = new Array();

        for (var fieldPartX = 0; fieldPartX < size; fieldPartX++) {
            for (var fieldPartY = 0; fieldPartY < size; fieldPartY++) {
                var enemyFigure = new Figure(passiveImage, Math.floor(Math.random() * 2));
                var v = GetNearestFreeFieldVector(gameMaze, new Vector2d(8 * (2 * fieldPartX + 1), 6 * (2 * fieldPartY + 1)));

                enemyFigure.location.x = 50 * v.x;
                enemyFigure.location.y = 50 * v.y;
                enemyFigure.speed = 2;
                allFigures.push(enemyFigure);
                enemyFigures.push(enemyFigure);
            }
        }
        var botController = new Wall2WallBotController(enemyFigures, gameMaze);
        botController.start();

        var humanController = new KeyboardController(humanFigure);
        humanController.start();

        gestures.init(humanFigure);

        doubleBufferCanvas = document.createElement("canvas");
        doubleBufferCanvas.width = windowWidth;
        doubleBufferCanvas.height = windowHeight;
        doubleBufferCanvasContext = doubleBufferCanvas.getContext("2d");

        GameLoop(null);
    }
}

function GetNearestFreeFieldVector(maze, startVector) {
    var xArray = new Array(0, 0, -1, -1, -1, 0, +1, +1, +1);
    var yArray = new Array(0, -1, -1, 0, +1, +1, +1, 0, -1);

    for (var index = 0; index < xArray.length; index++) {
        var fieldVector = startVector.add(new Vector2d(xArray[index], yArray[index]));
        if (maze.getFieldValue(fieldVector.x, fieldVector.y) == 0) {
            return fieldVector;
        }
    }
    return null;
}

function StartNewLevel() {}

function EndLevel() {}

var lastTimeStamp = 0;
var counter = 0;
var start = 0;
var instrumentLayerImage = null;
var lastFigureEnergy = null;
var imageCount = 3;
var dungeonImage = null;
var activeImage = null;
var passiveImage = null;
var viewPort = null;
var allFigures = null;
var gameMaze = null;
var humanFigure = null;
var doubleBufferCanvas = null;
var doubleBufferCanvasContext = null;
var instrumentLayerImageContext = null;
var windowWidth = 0;
var windowHeight = 0;
var canvasContext = null;

function Start() {

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
    //addHandler();
});
