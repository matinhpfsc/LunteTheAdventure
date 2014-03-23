'use strict';
/* global console, $, constants, settings, bombImage*/

function Item (obj){

  this.obj = obj;

  var _that = this;

  switch (obj.type) {
        case 'bomb':
            this.image = constants.sprites.bomb.file;
            this.animations = constants.sprites.bomb.animations;
            this.repeat = constants.sprites.bomb.repeat;
            setTimeout(function(){_that.goBack(); } , settings.game.bombTime);
            break;
    }

  // if this is a bomb then Tic Tic Tic Explode and go back to your owner
  // if this is a powerup, wait for getting collected
}

Item.prototype.goBack = function (){
    this.obj.level.pickupItem(this.obj);
};

Item.prototype.draw = function(viewPort) {


    var spriteY = 0;
    var spriteX = this.getAnimationIndex();

    this.obj.canvasContext.drawImage(bombImage, constants.maze.fieldSize * spriteX, constants.maze.fieldSize * spriteY, constants.maze.fieldSize, constants.maze.fieldSize, this.obj.location.x - viewPort.x, this.obj.location.y - viewPort.y, constants.maze.fieldSize, constants.maze.fieldSize);

};

Item.prototype.getAnimationIndex = function (){
    if (this.initalTime == null)
    {
        this.initalTime = $.now();
    }

    var duration = $.now() - this.initalTime;
    var animationIndex = Math.floor(duration * constants.fps / 1000);

    if ( animationIndex > this.animations )
    {
        if (this.repeat) {
            animationIndex = animationIndex % this.animations;
        }
        else {
            animationIndex = this.animations;
        }
    }

    return animationIndex;

};