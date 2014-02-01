'use strict';

function Maze(width, height) {
    this.EMPTY = 0;
    this.WALL = 1;

    //Set image indexes for the maze fields
    this.mazeSpriteIndexes = new Array(16);
    this.mazeSpriteIndexes[0] = 20;
    this.mazeSpriteIndexes[1] = 30;
    this.mazeSpriteIndexes[2] = 32;
    this.mazeSpriteIndexes[3] = 31;
    this.mazeSpriteIndexes[4] = 25;
    this.mazeSpriteIndexes[5] = 26;
    this.mazeSpriteIndexes[6] = 21;
    this.mazeSpriteIndexes[7] = 29;
    this.mazeSpriteIndexes[8] = 33;
    this.mazeSpriteIndexes[9] = 28;
    this.mazeSpriteIndexes[10] = 22;
    this.mazeSpriteIndexes[11] = 24;
    this.mazeSpriteIndexes[12] = 23;
    this.mazeSpriteIndexes[13] = 19;
    this.mazeSpriteIndexes[14] = 34;
    this.mazeSpriteIndexes[15] = 27;

    this.width = width;
    this.height = height;
    this.endCellColumn = 0;
    this.endCellRow = 0;
    var _this = this;

    this.mazeMatrix = new CreateLabyrint(width, height);
    this.gameMazeImage = this.CreateMazeImage(dungeonImage);

    function CreateLabyrint(width, height) {
        var mazeMatrix = [];
        for (var cellRow = 0; cellRow < height; cellRow++) {
            mazeMatrix[cellRow] = [];
            for (var cellColumn = 0; cellColumn < width; cellColumn++) {
                var value = 0;
                if (cellColumn == 0 || cellRow == 0 || cellColumn + 1 == width || cellRow + 1 == height) {
                    value = 1;
                }
                mazeMatrix[cellRow][cellColumn] = value;
            }
        }

        var side = Math.floor(Math.random() * 4);

        if (side == 0) {
            _this.endCellRow = 0;
            _this.endCellColumn = Math.floor(Math.random() * (width - 2)) + 1;
            mazeMatrix[0][_this.endCellColumn] = 0;
        } else {
            if (side == 1) {
                _this.endCellRow = Math.floor(Math.random() * (height - 2)) + 1;
                _this.endCellColumn = width - 1;
            } else {
                if (side == 1) {
                    _this.endCellRow = height - 1;
                    _this.endCellColumn = Math.floor(Math.random() * (width - 2)) + 1;
                } else {
                    _this.endCellRow = Math.floor(Math.random() * (height - 2)) + 1;
                    _this.endCellColumn = 0;
                }
            }
            mazeMatrix[_this.endCellRow][_this.endCellColumn] = 0;
        }

        DivideChamber(mazeMatrix, 1, 1, width - 2, height - 2);

        return mazeMatrix;
    }

    function DivideChamber(mazeMatrix, chamberX, chamberY, chamberWidth, chamberHeight) {
        var minimumCellSize = 1;
        minimumCellSize = Math.max(minimumCellSize, 1);

        var wallXPosition = GetWallXPosition(mazeMatrix, chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize);
        var wallYPosition = GetWallYPosition(mazeMatrix, chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize);

        var topDoorCap = 1;
        var bottomDoorCap = 1;
        var leftDoorCap = 1;
        var rightDoorCap = 1;

        var noDoorIndex = 0;
        if (wallXPosition != null && wallYPosition != null) {
            noDoorIndex = Math.floor(Math.random() * 4);
        } else {
            if (wallXPosition != null) {
                noDoorIndex = Math.floor(Math.random() * 2);
            } else {
                noDoorIndex = Math.floor(Math.random() * 2) + 2;
            }
        }


        if (noDoorIndex == 0) {
            topDoorCap = 0;
        } else {
            if (noDoorIndex == 1) {
                bottomDoorCap = 0;
            } else {
                if (noDoorIndex == 2) {
                    rightDoorCap = 0;
                } else {
                    if (noDoorIndex == 3) {
                        leftDoorCap = 0;
                    }
                }
            }
        }

        if (wallXPosition != null) {
            for (var y = chamberY + topDoorCap; y < chamberY + chamberHeight - bottomDoorCap; y++) {
                mazeMatrix[y][wallXPosition] = 1;
            }
        }
        if (wallYPosition != null) {
            for (var x = chamberX + leftDoorCap; x < chamberX + chamberWidth - rightDoorCap; x++) {
                mazeMatrix[wallYPosition][x] = 1;
            }
        }

        if (wallXPosition != null && wallYPosition != null) {
            //LT
            DivideChamber(mazeMatrix, chamberX, chamberY, wallXPosition - chamberX, wallYPosition - chamberY);
            //RT
            DivideChamber(mazeMatrix, wallXPosition + 1, chamberY, chamberX + chamberWidth - (wallXPosition + 1), wallYPosition - chamberY);
            //LB
            DivideChamber(mazeMatrix, chamberX, wallYPosition + 1, wallXPosition - chamberX, chamberY + chamberHeight - (wallYPosition + 1));
            //RB
            DivideChamber(mazeMatrix, wallXPosition + 1, wallYPosition + 1, chamberX + chamberWidth - (wallXPosition + 1), chamberY + chamberHeight - (wallYPosition + 1));
        } else {
            if (wallXPosition != null) {
                //L
                DivideChamber(mazeMatrix, chamberX, chamberY, wallXPosition - chamberX, chamberHeight);
                //R
                DivideChamber(mazeMatrix, wallXPosition + 1, chamberY, chamberX + chamberWidth - (wallXPosition + 1), chamberHeight);
            } else {
                if (wallYPosition != null) {
                    //T
                    DivideChamber(mazeMatrix, chamberX, chamberY, chamberWidth, wallYPosition - chamberY);
                    //B
                    DivideChamber(mazeMatrix, chamberX, wallYPosition + 1, chamberWidth, chamberY + chamberHeight - (wallYPosition + 1));
                }
            }
        }
    }

    function GetWallXPosition(mazeMatrix, chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize) {
        var validWallPositions = [];
        for (var x = chamberX + minimumCellSize; x < chamberX + chamberWidth - minimumCellSize; x++) {
            if (mazeMatrix[chamberY - 1][x] == 1 && mazeMatrix[chamberY + chamberHeight][x] == 1) {
                validWallPositions[validWallPositions.length] = x;
            }
        }

        if (validWallPositions.length > 0) {
            var index = Math.floor(Math.random() * validWallPositions.length);
            return validWallPositions[index];
        }
        return null;
    }

    function GetWallYPosition(mazeMatrix, chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize) {
        var validWallPositions = [];
        for (var y = chamberY + minimumCellSize; y < chamberY + chamberHeight - minimumCellSize; y++) {
            if (mazeMatrix[y][chamberX - 1] == 1 && mazeMatrix[y][chamberX + chamberWidth] == 1) {
                validWallPositions[validWallPositions.length] = y;
            }
        }

        if (validWallPositions.length > 0) {
            var index = Math.floor(Math.random() * validWallPositions.length);
            return validWallPositions[index];
        }
        return null;
    }
    return this;
}


Maze.prototype.GetSpriteIndex = function (cellColumn, cellRow) {
        if (_this.getFieldValue(cellColumn, cellRow) == 0) {
            return 8;
        } else {
            var left = _this.getFieldValue(cellColumn - 1, cellRow);
            var right = _this.getFieldValue(cellColumn + 1, cellRow);
            var top = _this.getFieldValue(cellColumn, cellRow - 1);
            var bottom = _this.getFieldValue(cellColumn, cellRow + 1);

            var number = left * 8 + bottom * 4 + right * 2 + top * 1;

            return this.mazeSpriteIndexes[number];
        }
    };


Maze.prototype.GetNearestFreeFieldVector = function (startVector) {
        var xArray = new Array(0, 0, -1, -1, -1, 0, +1, +1, +1);
        var yArray = new Array(0, -1, -1, 0, +1, +1, +1, 0, -1);

        for (var index = 0; index < xArray.length; index++) {
            var fieldVector = startVector.add(new Vector2d(xArray[index], yArray[index]));
            if (this.getFieldValue(fieldVector.x, fieldVector.y) == 0) {
                return fieldVector;
            }
        }
        return null;
    };



Maze.prototype.getFieldValue = function(cellColumn, cellRow) {
    if (cellColumn < 0 || cellRow < 0 || cellRow >= this.height || cellColumn >= this.width) {
        return this.EMPTY;
    }
    return this.mazeMatrix[cellRow][cellColumn];
};

Maze.prototype.draw = function(canvasContext, viewPort) {
    canvasContext.drawImage(this.gameMazeImage, viewPort.x, viewPort.y, viewPort.width, viewPort.height, 0, 0, viewPort.width, viewPort.height);
};

Maze.prototype.GetSpriteIndex = function(cellColumn, cellRow) {
    if (this.getFieldValue(cellColumn, cellRow) == this.EMPTY) {
        return 8;
    } else {
        var left = this.getFieldValue(cellColumn - 1, cellRow);
        var right = this.getFieldValue(cellColumn + 1, cellRow);
        var top = this.getFieldValue(cellColumn, cellRow - 1);
        var bottom = this.getFieldValue(cellColumn, cellRow + 1);

        var number = left * 8 + bottom * 4 + right * 2 + top * 1;

        return this.mazeSpriteIndexes[number];
    }
};

Maze.prototype.CreateMazeImage = function() {
    tools.log('createMazeImage');
    var mazeCanvas = document.createElement("canvas");
    mazeCanvas.width = this.width * 50;
    mazeCanvas.height = this.height * 50;
    var mazeCanvasContext = mazeCanvas.getContext("2d");

    for (var cellColumn = 0; cellColumn < mazeCanvas.width; cellColumn++) {
        for (var cellRow = 0; cellRow < mazeCanvas.height; cellRow++) {
            var spriteIndex = this.GetSpriteIndex(cellColumn, cellRow);

            var spriteY = Math.floor(spriteIndex / 5);
            var spriteX = spriteIndex % 5;
            mazeCanvasContext.drawImage(dungeonImage, 50 * spriteX, 50 * spriteY, 50, 50, cellColumn * 50, cellRow * 50, 50, 50);
        }
    }

    return mazeCanvas;
};
