'use strict'

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

ViewPort.prototype.draw = function(canvasContext, viewPort) {

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
        this.lastFigureEnergy = humanFigure.energy;
        this.instrumentLayerImageContext.clearRect(this.width - 150, 0, 104, 50);
        this.instrumentLayerImageContext.fillRect(this.width - 148, 22, this.lastFigureEnergy, 10);
        this.instrumentLayerImageContext.strokeRect(this.width - 150, 20, 104, 14);
    }

    canvasContext.drawImage(this.instrumentLayerImage, 0, 0);
}

ViewPort.prototype.CorrectViewPort = function() {
    var width = this.mazeWidth;
    var height = this.mazeHeight;

    var currentFigure = this.humanFigure;

    if (currentFigure.location.x - viewPort.x > this.width - 150) {
        viewPort.x = currentFigure.location.x - this.width + 150;
    }
    if (currentFigure.location.x - viewPort.x < 100) {
        viewPort.x = currentFigure.location.x - 100;
    }
    if (currentFigure.location.y - viewPort.y > this.height - 150) {
        viewPort.y = currentFigure.location.y - this.height + 150;
    }
    if (currentFigure.location.y - viewPort.y < 100) {
        viewPort.y = currentFigure.location.y - 100;
    }

    if (viewPort.x + this.width > width) {
        viewPort.x = width - this.width;
    }
    if (viewPort.x < 0) {
        viewPort.x = 0;
    }
    if (viewPort.y + this.height > height) {
        viewPort.y = height - this.height;
    }
    if (viewPort.y < 0) {
        viewPort.y = 0;
    }
}
