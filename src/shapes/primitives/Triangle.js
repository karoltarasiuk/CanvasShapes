/*global _, CanvasShapes*/

CanvasShapes.Triangle = (function () {

    var MIN_COORDINATES = 3,
        MAX_COORDINATES = 3;

    /**
     * Represents a quadrilateral. Accepts an array of exactly 4 coordinates.
     *
     * @param {array} coordinates
     */
    var Triangle = function (coordinates) {
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Triangle.prototype, CanvasShapes.Polygon.prototype, {

        className: 'CanvasShapes.Triangle'
    });

    return Triangle;
}());
