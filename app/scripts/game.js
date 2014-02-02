'use strict';

function Game() {
    var _this = this;
    var isPlaying = true;

    var lastTimeStamp = 0;
    this.humanKeyboardController = new KeyboardController();
    this.humanGestureController = new GestureController();

    this.level = new Level(_this);

    this.gameLoop = function (timeStamp) {
        var timeSpan = timeStamp - lastTimeStamp;
        timeSpan = Math.min(timeSpan, constants.maximumAnimationTimeSpan); //To avoid greate jumps.
        lastTimeStamp = timeStamp;

        for (var figureIndex = 0; figureIndex < _this.level.allFigures.length; figureIndex++) {
            var currentFigure = _this.level.allFigures[figureIndex];
            currentFigure.move(timeSpan);
            if (_this.level.humanFigure.bulletproofCountdown === 0 && currentFigure.isCollided(_this.level.humanFigure)) {
                _this.level.humanFigure.bulletproofCountdown = constants.bulletproofTimeSpan;
                _this.level.humanFigure.energy = Math.max(0, _this.level.humanFigure.energy - constants.defaultEnergyCollisionDecrease);
            }
        }

        _this.level.viewPort.CorrectViewPort();
        _this.level.DrawCanvas(timeSpan);

        if (_this.level.humanFigure.energy <= 0) {
            alert('You are death');
            return;
        }

        // Ausgang erreicht
        if (Math.floor((_this.level.humanFigure.location.x + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == _this.level.gameMaze.endCellColumn && Math.floor((_this.level.humanFigure.location.y + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == _this.level.gameMaze.endCellRow) {
            _this.nextLevel();
            return;
        }

        if (isPlaying)
        {
            window.requestAnimFrame(_this.gameLoop);
        }
    };

    return this;
}



Game.prototype.setPause = function ()
    {
        isPlaying = false;
    };

Game.prototype.setPlay = function ()
    {
        isPlaying = true;
        //lastTimeStamp = 0;
        this.gameLoop();
    };

Game.prototype.nextLevel = function ()
    {
        _this.level = new Level();
        _this.setPlay();

    };


