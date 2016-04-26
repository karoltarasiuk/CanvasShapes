/*global CanvasShapes*/

CanvasShapes.Circle = (function () {

    /**
     * Constructor is invoked as min and max would be set to 1, but then it is
     * translated to CanvasShapes.Arc format.
     */
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
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;

        this._mode = CanvasShapes.Arc.MODES.CIRCLE;

        this.validateCoordinates(coordinates, true);
        this.setCoordinates([coordinates]);

        // I have translated the original coordinates array to the one supported
        // by CanvasShapes.Arc, which means I need to adjust MAX_COORDINATES too
        this.MAX_COORDINATES = 3;

        this._radius = radius;
        this._startAngle = 0;
        this._endAngle = 2 * Math.PI;
    };

    CanvasShapes.Class.extend(Circle.prototype, CanvasShapes.Arc.prototype, {

        _className: 'CanvasShapes.Circle',

        /**
         * Coordinates are being translated to the array of coordinates to fit
         * CanvasShapes.Arc pattern.
         *
         * @implements {CanvasShapes.AnimationInterface}
         */
        move: function (totalAnimationTime, coordinates, callback, context) {

            if (CanvasShapes._.isArray(coordinates)) {
                coordinates = [coordinates];
            }

            CanvasShapes.Arc.prototype.move.call(
                this,
                totalAnimationTime,
                coordinates,
                callback,
                context
            );
        },

        /**
         * Circle's constructor doesn't accept custom angles, and always draw
         * full circle, hence shape is never open.
         *
         * @implements {CanvasShapes.ShapeInterface}
         * @override   {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {
            return false;
        }
    });

    return Circle;
}());
