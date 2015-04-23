/*global _, CanvasShapes*/

CanvasShapes.Quadrilateral = (function () {

    /**
     * Represents a quadrilateral. Accepts an array of exactly 4 coordinates.
     *
     * @param {array} coordinates
     */
    var Quadrilateral = function (coordinates) {
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Quadrilateral.prototype, CanvasShapes.Polygon.prototype, {

        className: 'CanvasShapes.Quadrilateral',

        _minimumPoints: 4,

        _maximumPoints: 4
    });

    return Quadrilateral;
}());
