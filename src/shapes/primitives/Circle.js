/*global _, CanvasShapes*/

CanvasShapes.Circle = (function () {

    var MIN_COORDINATES = 1,
        MAX_COORDINATES = 1;

    /**
     * Reprezents a circle. It takes single coordinates object of a
     * circle centre and radius.
     *
     * @param {array} coordinates
     * @param {float} radius
     */
    var Circle = function (coordinates, radius) {
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;

        this.mode = CanvasShapes.Arc.MODES.CIRCLE;

        this.validateCoordinates(coordinates, true);
        this.coordinates = [coordinates];

        this.radius = radius;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
    };

    CanvasShapes.Class.extend(Circle.prototype, CanvasShapes.Arc.prototype, {

        className: 'CanvasShapes.Circle'
    });

    return Circle;
}());
