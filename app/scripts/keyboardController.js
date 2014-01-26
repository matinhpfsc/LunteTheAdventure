'use strict';

function KeyboardController(figure) {
    this.controlledFigure = figure;
    this.onKeyDown = null;
    this.onKeyUp = null;

    this.keyCode = {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };
}

KeyboardController.prototype.start = function() {
    var _this = this;

    this.onKeyDown = function(event) {
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
        }
    };

    this.onKeyUp = function() {
        _this.controlledFigure.stopWalking();
    };

    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("keyup", this.onKeyUp, false);
};

KeyboardController.prototype.stop = function() {
    window.removeEventListener("keydown", this.onKeyDown, false);
    window.removeEventListener("keyup", this.onKeyUp, false);
};
