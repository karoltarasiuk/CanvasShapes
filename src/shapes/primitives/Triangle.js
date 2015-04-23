/*global _, CanvasShapes*/

CanvasShapes.Triangle = (function () {

    /**
     * Represents a quadrilateral. Accepts an array of exactly 4 coordinates.
     *
     * @param {array} coordinates
     */
    var Triangle = function (coordinates) {
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Triangle.prototype, CanvasShapes.Polygon.prototype, {

        className: 'CanvasShapes.Triangle',

        _minimumPoints: 3,

        _maximumPoints: 3
    });

    return Triangle;
}());
