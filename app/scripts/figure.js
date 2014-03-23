'use strict';
/* global console, Vector2d, game, settings, constants */

function Figure(image, imageIndex) {
    this.location = new Vector2d(0, 0);
    this.orientation = new Vector2d(0, 1);
    this.animationStartTimeStamp = null;
    this.image = image;
    this.imageIndex = imageIndex;
    this.maximumSpeed = 4;
    this.speed = 0;
    this.bulletproofCountdown = 0;
    this.energy = 100;

    this.UP = new Vector2d(0, -1);
    this.DOWN = new Vector2d(0, +1);
    this.LEFT = new Vector2d(-1, 0);
    this.RIGHT = new Vector2d(+1, 0);

    this.bombsMax = 1;
    this.bombsCurrent = 1;
    this.bombLength = 1;
    this.bombTime = settings.game.bombTime;

    return this;
}
Figure.prototype.getMazeFieldLocation = function() {
        return new Vector2d(Math.floor((this.location.x + 24.5) / constants.maze.fieldSize), Math.floor((this.location.y + 24.5) / constants.maze.fieldSize));
    };


Figure.prototype.move = function(timeSpan) {
        var figureCellPosition = this.getMazeFieldLocation();

        var cellLocation = figureCellPosition.mul(50);

        var distanceToCellLocation = (cellLocation.x - this.location.x) * this.orientation.x + (cellLocation.y - this.location.y) * this.orientation.y;

        var currentFigureSpeed = this.speed;
        if (currentFigureSpeed > distanceToCellLocation) {
            //Pruefe, ob naechtse Zelle begehbar ist.
            if (game.level.gameMaze.getFieldValue(figureCellPosition.x + this.orientation.x, figureCellPosition.y + this.orientation.y) === 1) {
                currentFigureSpeed = distanceToCellLocation;
            } else {
                var distanceToOtherCellLocation = ((cellLocation.x - this.location.x) * Math.abs(this.orientation.y) + (cellLocation.y - this.location.y) * Math.abs(this.orientation.x));

                var currentFigureOtherSpeed = Math.min(currentFigureSpeed, Math.abs(distanceToOtherCellLocation));

                var sgn = distanceToOtherCellLocation > 0 ? 1 : -1;
                this.location.x += sgn * Math.abs(this.orientation.y) * currentFigureOtherSpeed;
                this.location.y += sgn * Math.abs(this.orientation.x) * currentFigureOtherSpeed;
                currentFigureSpeed -= currentFigureOtherSpeed;
            }
        }

        this.location = this.location.add(this.orientation.mul(currentFigureSpeed));

        if (this.bulletproofCountdown > 0) {
            this.bulletproofCountdown -= timeSpan;
            if (this.bulletproofCountdown < 0) {
                this.bulletproofCountdown = 0;
            }
        }

        if (this.speed !== 0) {
            this.animationStartTimeStamp += timeSpan;
        }
    };

Figure.prototype.isCollided = function(otherFigure) {
        if (this === otherFigure) {
            return false;
        }
        var figureCellPosition = new Vector2d(Math.floor((this.location.x + 24.5) / 50), Math.floor((this.location.y + 24.5) / 50));
        var otherFigureCellPosition = new Vector2d(Math.floor((otherFigure.location.x + 24.5) / 50), Math.floor((otherFigure.location.y + 24.5) / 50));
        return figureCellPosition.equals(otherFigureCellPosition);
    };


Figure.prototype.startWalking = function(orientation) {
        this.orientation = orientation;
        this.speed = this.maximumSpeed;
    };

Figure.prototype.startWalkingUp = function() {
        this.startWalking(this.UP);
    };

Figure.prototype.startWalkingDown = function() {
        this.startWalking(this.DOWN);
    };

Figure.prototype.startWalkingLeft = function() {
        this.startWalking(this.LEFT);
    };

Figure.prototype.startWalkingRight = function() {
        this.startWalking(this.RIGHT);
    };

Figure.prototype.stopWalking = function() {
        this.speed = 0;
        this.animationStartTimeStamp = 0;
    };




Figure.prototype.draw = function(canvasContext, viewPort) {
    var animationIndex = Math.floor(this.animationStartTimeStamp / 100) % 8;
    var spriteIndex = 0;
    if (this.orientation.x > 0) {
        spriteIndex = 24;
    }
    if (this.orientation.x < 0) {
        spriteIndex = 8;
    }
    if (this.orientation.y > 0) {
        spriteIndex = 16;
    }
    spriteIndex += this.imageIndex * 4 * 8 + animationIndex;
    var spriteY = Math.floor(spriteIndex / 8);
    var spriteX = spriteIndex % 8;

    if ((Math.floor(this.bulletproofCountdown / 100)) % 3 < 2) {
        canvasContext.drawImage(this.image, constants.maze.fieldSize * spriteX, constants.maze.fieldSize * spriteY, constants.maze.fieldSize, constants.maze.fieldSize, this.location.x - viewPort.x, this.location.y - viewPort.y, constants.maze.fieldSize, constants.maze.fieldSize);
    }
};


Figure.prototype.dropBomb = function () {
    if (this.bombsCurrent > 0 )
    {
        console.log("drop Bomb");
        game.level.dropItem ({type:'bomb', length:this.bombLength , owner:this, bombTime:this.bombTime, location: this.location});
        this.bombsCurrent -= 1;

    }
};

Figure.prototype.pickupItem = function (obj) {
    switch (obj.type)
    {
        case 'bomb':
            console.log('pickup Bomb');
            if( this.bombsCurrent < this.bombsMax ) {
                this.bombsCurrent += 1;
            }
            break;
    }

};