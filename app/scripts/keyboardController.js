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
      var orientation = null;
      switch(event.keyCode)
      {
	  case 40: event.preventDefault(); orientation = DOWN; break;
	  case 38: event.preventDefault(); orientation = UP; break;
	  case 39: event.preventDefault(); orientation = RIGHT; break;
	  case 37: event.preventDefault(); orientation = LEFT; break;
      }
      if (orientation !== null)
      {
	_this.controlledFigure.startWalking(orientation);
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