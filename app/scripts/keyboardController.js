'use strict';
/* global $ */

function KeyboardController(figure) {
    this.controlledFigure = null;
    this.onKeyDown = null;
    this.onKeyUp = null;
    var _this = this;

    this.keyCode = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        dropBomb: 32
    };

    this.start = function (figure)
    {
        if (!this.controlledFigure)
        {
            this.controlledFigure = figure;
            this.addHandler();

        }
    };

    this.addHandler = function ()
    {
        $(document).on('keydown', function(event){

            switch (event.keyCode) {
                case _this.keyCode.down:
                    event.preventDefault();
                    _this.controlledFigure.startWalkingDown();
                    break;
                case _this.keyCode.up:
                    event.preventDefault();
                    _this.controlledFigure.startWalkingUp();
                    break;
                case _this.keyCode.right:
                    event.preventDefault();
                    _this.controlledFigure.startWalkingRight();
                    break;
                case _this.keyCode.left:
                    event.preventDefault();
                    _this.controlledFigure.startWalkingLeft();
                    break;
                case _this.keyCode.dropBomb:
                    event.preventDefault();
                    _this.controlledFigure.dropBomb();
                    break;
            }
        });

        $(document).on('keyup', function(event){
            _this.controlledFigure.stopWalking();
        });
    };

    this.removeHandler = function ()
    {
        $(document).off('keydown keyup');

    };

    this.stop = this.removeHandler;

    if (figure)
    {
        this.start(figure);
    }

    return this;
}
