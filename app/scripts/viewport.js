'use strict';

function ViewPort(width, height, mazeWidthInPixel, mazeHeightInPixel, humanFigure) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.mazeWidth = mazeWidthInPixel;
    this.mazeHeight = mazeHeightInPixel;
    this.instrumentLayerImage = null;
    this.instrumentLayerImageContext = null;
    this.lastFigureEnergy = null;
    this.humanFigure = humanFigure;
}

ViewPort.prototype.draw = function(canvasContext) {

    if (this.instrumentLayerImage == null) {
        this.instrumentLayerImage = document.createElement("canvas");
        this.instrumentLayerImage.width = this.width;
        this.instrumentLayerImage.height = this.height;
        this.instrumentLayerImageContext = this.instrumentLayerImage.getContext("2d");
    }

    if (this.lastFigureEnergy != this.humanFigure.energy) {
        if (this.lastFigureEnergy == null) {
            this.instrumentLayerImageContext.fillStyle = "#FF0000";
            this.instrumentLayerImageContext.strokeStyle = "#000000";
        }
        this.lastFigureEnergy = this.humanFigure.energy;
        this.instrumentLayerImageContext.clearRect(this.width - 150, 0, 104, 50);
        this.instrumentLayerImageContext.fillRect(this.width - 148, 22, this.lastFigureEnergy, 10);
        this.instrumentLayerImageContext.strokeRect(this.width - 150, 20, 104, 14);
    }

    canvasContext.drawImage(this.instrumentLayerImage, 0, 0);
};

ViewPort.prototype.CorrectViewPort = function() {
    var width = this.mazeWidth;
    var height = this.mazeHeight;

    var currentFigure = this.humanFigure;

    if (currentFigure.location.x - this.x > this.width - 150) {
        this.x = currentFigure.location.x - this.width + 150;
    }
    if (currentFigure.location.x - this.x < 100) {
        this.x = currentFigure.location.x - 100;
    }
    if (currentFigure.location.y - this.y > this.height - 150) {
        this.y = currentFigure.location.y - this.height + 150;
    }
    if (currentFigure.location.y - this.y < 100) {
        this.y = currentFigure.location.y - 100;
    }

    if (this.x + this.width > width) {
        this.x = width - this.width;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y + this.height > height) {
        this.y = height - this.height;
    }
    if (this.y < 0) {
        this.y = 0;
    }
};
