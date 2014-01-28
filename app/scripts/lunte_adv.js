'use strict';

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

    viewPort.CorrectViewPort();
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
    for (var drawingObjectIndex = 0; drawingObjectIndex < drawingObjects.length; drawingObjectIndex++) {
        drawingObjects[drawingObjectIndex].draw(canvasContext, viewPort);
    }
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



function OnImageLoaded() {
    imageCount--;
    if (imageCount == 0) {
        var size = 2;
        var width = 16 * size;
        var height = 12 * size;

        allFigures = new Array();

        humanFigure = new Figure(activeImage, 1);
        humanFigure.location.x = 50;
        humanFigure.location.y = 50;
        allFigures.push(humanFigure);

        viewPort = new ViewPort(windowWidth, windowHeight, width * 50, height * 50, humanFigure);

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

        drawingObjects = new Array();
        drawingObjects.push(gameMaze);
        for (var figureIndex = 0; figureIndex < allFigures.length; figureIndex++) {
            drawingObjects.push(allFigures[figureIndex]);
        }
        drawingObjects.push(viewPort);

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
var imageCount = 3;
var dungeonImage = null;
var activeImage = null;
var passiveImage = null;
var viewPort = null;
var allFigures = null;
var gameMaze = null;
var humanFigure = null;
var windowWidth = 0;
var windowHeight = 0;
var canvasContext = null;
var drawingObjects = null;

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
