'use strict';

function Item (obj){

  this.obj = obj;
  this.bulletproofCountdown = 0;
  var _that = this;

  switch (obj.type) {
        case 'bomb':
            this.image = constants.sprites.bomb.file;
            this.animations = constants.sprites.bomb.animations;
            setTimeout(function(){_that.goBack() } ,settings.game.bombTime);
            break;
    }

  // if this is a bomb then Tic Tic Tic Explode and go back to your owner
  // if this is a powerup, wait for getting collected
}

Item.prototype.goBack = function (){
    this.obj.level.pickupItem(this.obj);
};

Item.prototype.draw = function(canvasContext, viewPort) {


    var spriteY = 0;
    var spriteX = Math.floor(this.animationStartTimeStamp / 100) % this.animations;

    if ((Math.floor(this.bulletproofCountdown / 100)) % 3 < 2) {
        canvasContext.drawImage(bombImage, 50 * spriteX, 50 * spriteY, 50, 50, this.obj.location.x - viewPort.x, this.obj.location.y - viewPort.y, 50, 50);
    }
};