'use strict';

describe('Vector2d is a class with an x and y value', function() {
    it('and x and y have the value set via the constructor', function() {
        var vector1 = new Vector2d(1, 2);
        expect(vector1.x).toBe(1);
        expect(vector1.y).toBe(2);

        var vector2 = new Vector2d(-1, -2);
        expect(vector2.x).toBe(-1);
        expect(vector2.y).toBe(-2);

        var vector3 = new Vector2d(0, 0);
        expect(vector3.x).toBe(0);
        expect(vector3.y).toBe(0);
    });

    it('and x and y should be writable after initialisation', function() {
        var vector1 = new Vector2d(1, 2);

        vector1.x = -1;
        vector1.y = -2;

        expect(vector1.x).toBe(-1);
        expect(vector1.y).toBe(-2);
    });

    it('and x and y can be multiplied by a scalar', function() {
        var vector1 = new Vector2d(0, 0);
        var vector1Result = vector1.mul(10);
        expect(vector1.x).toBe(0);
        expect(vector1.y).toBe(0);
        expect(vector1Result.x).toBe(0);
        expect(vector1Result.y).toBe(0);

        var vector2 = new Vector2d(-1, -1);
        var vector2Result = vector2.mul(5);
        expect(vector2.x).toBe(-1);
        expect(vector2.y).toBe(-1);
        expect(vector2Result.x).toBe(-5);
        expect(vector2Result.y).toBe(-5);

        var vector3 = new Vector2d(-10, 5);
        var vector3Result = vector2.mul(0);
        expect(vector3.x).toBe(-10);
        expect(vector3.y).toBe(5);
        expect(vector3Result.x).toBe(0);
        expect(vector3Result.y).toBe(0);
    });

    it('and the sum of two vector2d objects can be computed using add()', function() {
        var vector1 = new Vector2d(3, -5);
        var vector2 = new Vector2d(0, 0);
        var vector3 = new Vector2d(-1, -1);
        var vector4 = new Vector2d(1, 1);

        var addResult;

        addResult = vector1.add(vector2);
        expect(vector1.x).toBe(3);
        expect(vector1.y).toBe(-5);
        expect(addResult.x).toBe(3);
        expect(addResult.y).toBe(-5);

        addResult = vector1.add(vector3);
        expect(vector1.x).toBe(3);
        expect(vector1.y).toBe(-5);
        expect(addResult.x).toBe(2);
        expect(addResult.y).toBe(-6);

        addResult = vector1.add(vector4);
        expect(vector1.x).toBe(3);
        expect(vector1.y).toBe(-5);
        expect(addResult.x).toBe(4);
        expect(addResult.y).toBe(-4);
    });

    it('and two vector2d objects can be compared using equals()', function() {
        var vector1 = new Vector2d(1, 2);
        var vector2 = new Vector2d(1, 2);
        var vector3 = new Vector2d(-1, 2);
        var vector4 = new Vector2d(1, -2);
        var vector5 = new Vector2d(10, 2);
        var vector6 = new Vector2d(1, 20);
        var vector7 = new Vector2d(10, -20);

        expect(vector1.equals(vector2)).toBe(true);
        expect(vector1.equals(vector3)).toBe(false);
        expect(vector1.equals(vector4)).toBe(false);
        expect(vector1.equals(vector5)).toBe(false);
        expect(vector1.equals(vector6)).toBe(false);
        expect(vector1.equals(vector7)).toBe(false);
    });
});
