'use strict'

function Wall2WallBotController(figures, gameMaze) {
    this.controlledFigures = figures;
    this.gameMaze = gameMaze;
    this.taskId = null;
    this.constants = {
        intervalTime: 250, // in milliseconds
        mazeFieldSize: 50, // in pixel
        allDirectionVectors: new Array(new Vector2d(0, +1), new Vector2d(+1, 0), new Vector2d(0, -1), new Vector2d(-1, 0))
    };
}

Wall2WallBotController.prototype.start = function() {
    if (this.taskId === null) {
        var _this = this; //Because in the calculateNextStep function this is the window object

        var calculateNextStep = function() {
            for (var figureIndex = 0; figureIndex < _this.controlledFigures.length; figureIndex++) {
                var currentFigure = _this.controlledFigures[figureIndex];
                var figureCellPosition = currentFigure.getMazeFieldLocation();

                if (_this.gameMaze.getFieldValue(figureCellPosition.x + currentFigure.orientation.x, figureCellPosition.y + currentFigure.orientation.y) == 1) {
                    var possibleWays = new Array();
                    for (var directionIndex = 0; directionIndex < _this.constants.allDirectionVectors.length; directionIndex++) {
                        var currentDirectionVector = _this.constants.allDirectionVectors[directionIndex];
                        var nextPossibleFieldVector = figureCellPosition.add(currentDirectionVector);
                        if (_this.gameMaze.getFieldValue(nextPossibleFieldVector.x, nextPossibleFieldVector.y) == 0 && !currentFigure.orientation.equals(currentDirectionVector.mul(-1))) {
                            possibleWays.push(currentDirectionVector);
                        }
                    }

                    if (possibleWays.length > 0) {
                        currentFigure.orientation = possibleWays[Math.floor(Math.random() * possibleWays.length)];
                    } else {
                        currentFigure.orientation = currentFigure.orientation.mul(-1);
                    }
                }
            }
        };

        this.taskId = setInterval(calculateNextStep, this.constants.intervalTime);
    }
};

Wall2WallBotController.prototype.stop = function() {
    if (this.taskId !== null) {
        clearInterval(this.taskId);
        this.taskId = null;
    }
};
