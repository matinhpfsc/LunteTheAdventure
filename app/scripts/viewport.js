'use strict';

function ViewPort(width, height) {

    var _this = this;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;

    this.correctViewPort = function (figure, maze) {
        var width = maze.width;
        var height = maze.height;
        //var width = 32;
        //var height = 24;

        var currentFigure = figure;

        if (currentFigure.location.x - this.x > windowWidth - 150) {
            this.x = currentFigure.location.x - windowWidth + 150;
        }
        if (currentFigure.location.x - this.x < 100) {
            this.x = currentFigure.location.x - 100;
        }
        if (currentFigure.location.y - this.y > windowHeight - 150) {
            this.y = currentFigure.location.y - windowHeight + 150;
        }
        if (currentFigure.location.y - this.y < 100) {
            this.y = currentFigure.location.y - 100;
        }

        if (this.x + windowWidth > width * 50) {
            this.x = width * 50 - windowWidth;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y + windowHeight > height * 50) {
            this.y = height * 50 - windowHeight;
        }
        if (this.y < 0) {
            this.y = 0;
        }
    };

  //  window.viewPort = this;
    return this;
}