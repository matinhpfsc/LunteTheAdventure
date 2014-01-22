'use strict';

function Vector2d(x, y) {
    this.x = x;
    this.y = y;

    this.mul = function(scalar) {
        return new Vector2d(this.x * scalar, this.y * scalar);
    };

    this.add = function(otherVector) {
        return new Vector2d(this.x + otherVector.x, this.y + otherVector.y);
    };

    this.equals = function(otherVector) {
        return this.x === otherVector.x && this.y === otherVector.y;
    };
}
