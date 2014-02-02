'use strict';

function Level(thisGame) {

    var _this = this;
    var _thisGame = thisGame;

    var size = 2;
    var width = 16 * size;
    var height = 12 * size;

    this.allFigures = [];

    this.humanFigure = new Figure(activeImage, 1);
    this.humanFigure.location.x = 50;
    this.humanFigure.location.y = 50;
    this.allFigures.push(this.humanFigure);

    this.viewPort = new ViewPort(windowWidth, windowHeight, width * 50, height * 50, this.humanFigure);

    thisGame.humanKeyboardController.start(this.humanFigure);
    thisGame.humanGestureController.start(this.humanFigure);

    this.gameMaze = new Maze(width, height);

    this.enemyFigures = [];

    for (var fieldPartX = 0; fieldPartX < size; fieldPartX++) {
        for (var fieldPartY = 0; fieldPartY < size; fieldPartY++) {
            var enemyFigure = new Figure(passiveImage, Math.floor(Math.random() * 2));
            var v = this.gameMaze.GetNearestFreeFieldVector(new Vector2d(8 * (2 * fieldPartX + 1), 6 * (2 * fieldPartY + 1)));

            enemyFigure.location.x = 50 * v.x;
            enemyFigure.location.y = 50 * v.y;
            enemyFigure.speed = 2;
            this.allFigures.push(enemyFigure);
            this.enemyFigures.push(enemyFigure);
        }
    }
    this.botController = new Wall2WallBotController(this.enemyFigures, this.gameMaze);
    this.botController.start();

    return this;
    }

Level.prototype.DrawCanvas = function(timeSpan) {

        this.gameMaze.draw( canvasContext, this.viewPort);

        for (var figureIndex = 0; figureIndex < this.allFigures.length; figureIndex++) {
            this.allFigures[figureIndex].draw(canvasContext, this.viewPort);
        }

        this.viewPort.draw(canvasContext);
};
