/*global _, CanvasShapes*/

CanvasShapes.Arc = (function () {

    /**
     * Represents an arc shape, Equivalent of canvas `arc` and `arcTo` methods.
     *
     * Depending on configuration of arguments you pass, it will go into
     * one of two modes:
     * - circle (when coordinates is an array of 1), it uses `arc`
     * - point-to-point (when coordinates is an array of 3), it uses `arcTo`
     *
     * The rest arguments specify the behaviour of an arc, and pretty much are
     * passed to canvas element method. The only exception is, that `arcTo` by
     * default doesn't draw a line to the third point, while this object does.
     *
     * @param {array} coordinates
     * @param {float} radius
     * @param {float} startAngle
     * @param {float} endAngle
     * @param {boolean} anticlockwise
     */
    var Arc = function (coordinates, radius, startAngle, endAngle, anticlockwise) {

        if (
            !_.isArray(coordinates) ||
            coordinates.length !== 1 ||
            coordinates.length !== 3
        ) {
            throw new CanvasShapes.Error();
        }

        if (_.isUndefined(radius)) {
            throw new CanvasShapes.Error();
        }

        if (_.isUndefined(startAngle)) {
            startAngle = 0;
        }

        if (_.isUndefined(endAngle)) {
            endAngle = 2 * Math.PI;
        }

        if (anticlockwise !== true) {
            anticlockwise = false;
        }

        if (coordinates.length === 1) {
            this.mode = Arc.MODES.CIRCLE;
        } else {
            this.mode = Arc.MODES.POINTTOPOINT;
        }

        this.coordinates = coordinates;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.anticlockwise = anticlockwise;
    };

    /**
     * Modes in which CanvasShapes.Arc operates
     * @type {object}
     */
    Arc.MODES = {
        CIRCLE: 'circle',
        POINTTOPOINT: 'point-top-point'
    };

    CanvasShapes.Class.extend(Arc.prototype, CanvasShapes.Shape.prototype, {

        className: 'CanvasShapes.Arc',

        /**
         * See Arc.MODES
         * @type {string}
         */
        mode: null,

        /**
         * Coordinates of either 1 or 3 points, depending on mode
         * @type {array}
         */
        coordinates: null,

        /**
         * Radius af an arc to draw
         * @type {float}
         */
        radius: null,

        /**
         * In case of an arc(), starting angle in radians
         * @type {float}
         */
        startAngle: null,

        /**
         * In case of an arc(), ending angle in radians
         * @type {float}
         */
        endAngle: null,

        /**
         * In case of an arc(), whether to draw an arc in anticlockwise manner
         * @type {boolean}
         */
        anticlockwise: false,

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function () {

            var style = this.getStyle(),
                layer = this.getLayer(),
                context = layer.getContext(),
                coordinates = this.processCoordinates(
                    this.coordinates,
                    true,
                    layer.getWidth(),
                    layer.getHeight()
                );

            context.beginPath();

            if (this.mode === Arc.MODES.CIRCLE) {
                context.arc(
                    coordinates[0][0],
                    coordinates[0][1],
                    this.radius,
                    this.startAngle,
                    this.endAngle,
                    this.anticlockwise
                );

                context.closePath();

            } else {
                context.moveTo(
                    coordinates[0][0],
                    coordinates[0][1]
                );
                context.arcTo(
                    coordinates[1][0],
                    coordinates[1][1],
                    coordinates[2][0],
                    coordinates[2][1],
                    this.radius
                );
                context.lineTo(
                    coordinates[2][0],
                    coordinates[2][1]
                );

                context.closePath();
            }

            style.set(layer);
        },

        /**
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCoordinates: function () {
            return this.coordinates[0];
        }
    });

    return Arc;
}());
