'use strict';

function Game() {
    var _this = this;
    this.level = new Level();

    this.gameLoop = function (timeStamp) {
        var timeSpan = timeStamp - lastTimeStamp;
        timeSpan = Math.min(timeSpan, constants.maximumAnimationTimeSpan); //To avoid greate jumps.
        lastTimeStamp = timeStamp;

        for (var figureIndex = 0; figureIndex < _this.level.allFigures.length; figureIndex++) {
            var currentFigure = _this.level.allFigures[figureIndex];
            currentFigure.move(timeSpan);
            if (_this.level.humanFigure.bulletproofCountdown == 0 && currentFigure.isCollided(_this.level.humanFigure)) {
                _this.level.humanFigure.bulletproofCountdown = constants.bulletproofTimeSpan;
                _this.level.humanFigure.energy = Math.max(0, _this.level.humanFigure.energy - constants.defaultEnergyCollisionDecrease);
            }
        }

        _this.level.doCorrectViewPort();
        DrawCanvas(timeSpan, _this.level.viewPort);

        if (_this.level.humanFigure.energy <= 0) {
            alert("You are death");
            return;
        }

        if (Math.floor((_this.level.humanFigure.location.x + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == _this.level.gameMaze.endCellColumn && Math.floor((_this.level.humanFigure.location.y + (constants.mazeFieldSize / 2)) / constants.mazeFieldSize) == _this.level.gameMaze.endCellRow) {
            _this.level = new Level();
            _this.gameLoop();
            //alert('Exit erreicht');

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
         */
        {
            window.requestAnimFrame(_this.gameLoop);
        }
    };

    return this;
}
