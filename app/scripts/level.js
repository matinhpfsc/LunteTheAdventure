'use strict';

function Level(thisGame) {

    var _this = this;
    var thisGame = thisGame;

    this.viewPort = new ViewPort(windowWidth, windowHeight);
    this.allFigures = new Array();

    this.humanFigure = new Figure(activeImage, 1);
    this.humanFigure.location.x = 50;
    this.humanFigure.location.y = 50;
    this.allFigures.push(this.humanFigure);

    thisGame.humanKeyboardController.start(this.humanFigure);
    thisGame.humanGestureController.start(this.humanFigure);


    // Size from Imagecount
    this.gameMaze = new Maze(32, 24);
    this.gameMazeImage = this.gameMaze.CreateMazeImage(this.gameMaze);

    this.viewPort.correctViewPort(this.humanFigure, this.gameMaze);

    this.doCorrectViewPort = function (){
        this.viewPort.correctViewPort(this.humanFigure, this.gameMaze);
    };

    this.enemyFigures = new Array();

    var size = 2;
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
    };
