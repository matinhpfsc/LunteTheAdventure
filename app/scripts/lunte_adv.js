
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




function OnImageLoaded() {
    imageCount--;
    if (imageCount === 0) {
        var size = 2;
        var width = 16 * size;
        var height = 12 * size;

        game = new Game();
        game.gameLoop(null);
    }
}

var game = null;
var start = 0;
var imageCount = 3;
var dungeonImage = null;
var activeImage = null;
var passiveImage = null;
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
});
