'use strict';

function Item (obj){

  this.obj = obj;
  var _that = this;

  switch (obj.type) {
        case 'bomb':
            setTimeout(function(){_that.goBack() } ,settings.game.bombTime);
            break;
    }

  // if this is a bomb then Tic Tic Tic Explode and go back to your owner
  // if this is a powerup, wait for getting collected
}

Item.prototype.goBack = function (){
    this.obj.level.pickupItem(this.obj);
}