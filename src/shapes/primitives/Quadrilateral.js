/*global CanvasShapes*/

CanvasShapes.Quadrilateral = (function () {

    var MIN_COORDINATES = 4,
        MAX_COORDINATES = 4;

    /**
     * Represents a quadrilateral. Accepts an array of exactly 4 coordinates.
     *
     * @param {array} coordinates
     */
    var Quadrilateral = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.initialise(coordinates);
    };

    CanvasShapes.Class.extend(
        Quadrilateral.prototype,
        CanvasShapes.Polygon.prototype,
    {
        className: 'CanvasShapes.Quadrilateral'
    });

    return Quadrilateral;
}());
