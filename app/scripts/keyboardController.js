'use strict';

function KeyboardController(figure)
{
  this.controlledFigure = figure;
  this.onKeyDown = null;
  this.onKeyUp = null;
  
  this.start = function()
  {
    var _this = this;
    
    this.onKeyDown = function(event)
    {
      switch(event.keyCode)
      {
	  case 40: event.preventDefault(); _this.controlledFigure.startWalkingDown(); break;
	  case 38: event.preventDefault(); _this.controlledFigure.startWalkingUp(); break;
	  case 39: event.preventDefault(); _this.controlledFigure.startWalkingRight(); break;
	  case 37: event.preventDefault(); _this.controlledFigure.startWalkingLeft(); break;
      }
    };
    
    this.onKeyUp = function()
    {
      _this.controlledFigure.stopWalking();
    };
    
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup", this.onKeyUp, false);
  };
  
  this.stop = function()
  {
    window.removeEventListener("keydown", this.onKeyDown, false);
    window.removeEventListener("keyup", this.onKeyUp, false);
  };
}