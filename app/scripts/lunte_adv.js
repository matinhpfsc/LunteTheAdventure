'use strict';
/* global $ */

var game = null;
var dungeonImage = null;
var activeImage = null;
var passiveImage = null;
var bombImage = null;
var windowWidth = 0;
var windowHeight = 0;
var canvasContext = null;
var imageCount = 4;

$(document).ready(function() {
    var canvas = document.getElementById('lunte-canvas');

    windowWidth = canvas.width;
    windowHeight = canvas.height;

    canvasContext = canvas.getContext("2d");

    window.requestAnimFrame = GetRequestAnimFrameFunction();

    // Diese Lösung funktioniert, aber benötigt Zeit, da während des Ladens
    // die CPU nichts zu tun hat. Das müßte parallelisiert werden.
    // Und der Ladevorgang umgeht leider das Caching.
    StartImageLoading();


});

function StartImageLoading() {

    dungeonImage = new Image();
    dungeonImage.onload = OnImageLoaded;
    dungeonImage.src = 'images/dungeon3.png';

    activeImage = new Image();
    activeImage.onload = OnImageLoaded;
    activeImage.src = 'images/aktive.png';

    passiveImage = new Image();
    passiveImage.onload = OnImageLoaded;
    passiveImage.src = 'images/passive.png';

    bombImage = new Image();
    bombImage.onload = OnImageLoaded;
    bombImage.src = 'images/passive.png';
}

function OnImageLoaded() {
    imageCount--;
    if (imageCount == 0) {
        game = new Game();
        game.gameLoop(null);
    }
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
