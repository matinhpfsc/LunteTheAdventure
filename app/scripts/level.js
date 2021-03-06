'use strict';
/* global Figure, activeImage, passiveImage, settings, Wall2WallBotController, Maze, Item, canvasContext, Vector2d, ViewPort, windowWidth, windowHeight*/
function Level(thisGame) {

    var _this = this;

    var size = 2;
    var width = 16 * size;
    var height = 12 * size;

    this.items = [];
    this.allFigures = [];

    this.humanFigure = new Figure(activeImage, settings.user.avatar, canvasContext);
    this.humanFigure.location.x = 50;
    this.humanFigure.location.y = 50;
    this.allFigures.push(this.humanFigure);

    this.viewPort = new ViewPort(windowWidth, windowHeight, width * 50, height * 50, this.humanFigure, canvasContext);

    thisGame.humanKeyboardController.start(this.humanFigure);
    thisGame.humanGestureController.start(this.humanFigure);

    this.gameMaze = new Maze(width, height, canvasContext);

    this.enemyFigures = [];

    for (var fieldPartX = 0; fieldPartX < size; fieldPartX++) {
        for (var fieldPartY = 0; fieldPartY < size; fieldPartY++) {
            var enemyFigure = new Figure(passiveImage, Math.floor(Math.random() * 2),canvasContext);
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

        this.gameMaze.draw( this.viewPort);

        for (var figureIndex = 0; figureIndex < this.allFigures.length; figureIndex++) {
            this.allFigures[figureIndex].draw( this.viewPort);
        }

       for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
            this.items[itemIndex].draw( this.viewPort);
        }

        this.viewPort.draw();
};

Level.prototype.dropItem = function (item) {

    var localItem = item;
    localItem.canvasContext = canvasContext;
    localItem.level = this;

    var obj = new Item (item);

    this.items.push(obj);
};

Level.prototype.pickupItem = function (item) {

    item.owner.pickupItem(item);
    this.items.pop(item);

};
