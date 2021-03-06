/*global CanvasShapes*/

CanvasShapes.Arc = (function () {

    var MIN_COORDINATES = 1,
        MAX_COORDINATES = 3;

    /**
     * Represents an arc shape, equivalent of canvas `arc` and `arcTo` methods.
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
     * Start and end angles must be passed in radians. You can use
     * CanvasShapes.GeometryTools to convert degrees to radians.
     *
     * @throws {CanvasShapes.Error} 1024
     * @throws {CanvasShapes.Error} 1025
     *
     * @param {array}   coordinates
     * @param {float}   radius
     * @param {float}   startAngle [OPTIONAL]
     * @param {float}   endAngle [OPTIONAL]
     * @param {boolean} anticlockwise [OPTIONAL]
     */
    var Arc = function (
        coordinates,
        radius,
        startAngle,
        endAngle,
        anticlockwise
    ) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;

        if (
            !CanvasShapes._.isArray(coordinates) ||
            (coordinates.length !== 1 && coordinates.length !== 3)
        ) {
            throw new CanvasShapes.Error(1024);
        }

        if (radius === undefined) {
            throw new CanvasShapes.Error(1025);
        }

        if (startAngle === undefined) {
            startAngle = 0;
        }

        if (endAngle === undefined) {
            endAngle = 2 * Math.PI;
        }

        if (anticlockwise !== true) {
            anticlockwise = false;
        }

        if (coordinates.length === 1) {
            this._mode = Arc.MODES.CIRCLE;
        } else {
            this._mode = Arc.MODES.POINTTOPPOINT;
        }

        // checking if passed coordinates are in a correct format
        this.validateCoordinatesArray(
            coordinates,
            true,
            this.MIN_COORDINATES,
            this.MAX_COORDINATES
        );

        this.setCoordinates(coordinates);
        this._radius = radius;
        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._anticlockwise = anticlockwise;
    };

    /**
     * Modes in which CanvasShapes.Arc operates
     *
     * @type {object}
     */
    Arc.MODES = {
        CIRCLE: 'circle',
        POINTTOPPOINT: 'point-top-point'
    };

    CanvasShapes.Class.extend(Arc.prototype, CanvasShapes.Shape.prototype, {

        _className: 'CanvasShapes.Arc',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            var style = this.getStyle(),
                context = layer.getContext(),
                coordinates = this.processCoordinates(
                    this.getCoordinates(), layer
                ),
                radius = this._radius;

            if (
                CanvasShapes._.isObject(layer) &&
                CanvasShapes._.isFunction(layer.is) &&
                layer.is(CanvasShapes.SceneLayerInterface) &&
                this.is(CanvasShapes.RenderingInterface) &&
                this.getRelativeRendering()
            ) {
                // radius is calculated relatively to the layer width
                radius = radius * layer.getWidth() / 100;
                // @TODO https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse
            }

            if (!continuePath) {
                context.beginPath();
            }

            if (this._mode === Arc.MODES.CIRCLE) {
                context.arc(
                    coordinates[0][0],
                    coordinates[0][1],
                    radius,
                    this._startAngle,
                    this._endAngle,
                    this._anticlockwise
                );

            } else {

                if (
                    !endPointCoordinates ||
                    !this.areCoordinatesEqual([
                        coordinates[0], endPointCoordinates
                    ])
                ) {
                    context.moveTo(
                        coordinates[0][0],
                        coordinates[0][1]
                    );
                }

                context.arcTo(
                    coordinates[1][0],
                    coordinates[1][1],
                    coordinates[2][0],
                    coordinates[2][1],
                    radius
                );
                context.lineTo(
                    coordinates[2][0],
                    coordinates[2][1]
                );
            }

            if (!continuePath) {
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * It will return the center point of an arc.
         *
         * @implements {CanvasShapes.CoordinatesInterface}
         */
        getCentreCoordinates: function () {

            // returns center point of a circle
            if (this._mode === Arc.MODES.CIRCLE) {
                return this.getCoordinates()[0];
            }

            return CanvasShapes.Shape.prototype.getCentreCoordinates.call(this);
        },

        /**
         * @throws {CanvasShapes.Error} 1058
         *
         * @implements {CanvasShapes.InteractionInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isColliding: function (mouseCoordinates) {

            var layer, allowedError, ellipseRadius, coordinates, lineThickness;

            if (
                !CanvasShapes._.isObject(mouseCoordinates) ||
                !CanvasShapes._.isNumber(mouseCoordinates.x) ||
                !CanvasShapes._.isNumber(mouseCoordinates.y) ||
                !CanvasShapes._.isObject(mouseCoordinates.scene) ||
                !CanvasShapes._.isFunction(mouseCoordinates.scene.is) ||
                !mouseCoordinates.scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1058);
            }

            layer = mouseCoordinates.scene.getLayer(this);
            coordinates = this.processCoordinates(
                this.getCoordinates(), layer
            );

            if (this.isShapeClosed()) {

                // if the circle uses relative rendering,
                // it can become an ellipse
                if (this.getRelativeRendering()) {
                    ellipseRadius = this.processCoordinates(
                        [this._radius, this._radius], layer
                    );
                    lineThickness = this.getLineWidth() * layer.getWidth() / 100;
                } else {
                    ellipseRadius = [this._radius, this._radius];
                    lineThickness = this.getLineWidth();
                }

                // for filled shape, hover will work also inside the circle
                if (this.isFilled()) {
                    return CanvasShapes.GeometryTools.isInsideEllipse(
                        [mouseCoordinates.x, mouseCoordinates.y],
                        coordinates[0],
                        ellipseRadius[0],
                        ellipseRadius[1],
                        lineThickness
                    );
                } else {
                    return CanvasShapes.GeometryTools.isOnEllipse(
                        [mouseCoordinates.x, mouseCoordinates.y],
                        coordinates[0],
                        ellipseRadius[0],
                        ellipseRadius[1],
                        lineThickness
                    );
                }

            } else {
                // @TODO only whether pointer is on the arc
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @override   {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {

            var coordinates, startMod, endMod,
                fullCircle = 2 * Math.PI;

            // if mode is point-to-point, we check whether first and second
            // points' coordinates are equal
            if (this._mode === Arc.MODES.POINTTOPPOINT) {
                coordinates = this.getCoordinates();
                return !this.areCoordinatesEqual([
                    coordinates[0],
                    coordinates[2]
                ]);

            // if it's a circle we check start and end angle
            } else {
                // removing obvious case
                if (this._startAngle === this._endAngle) {
                    return true;
                // start is zero
                } else if (this._startAngle === 0) {
                    endMod = this._endAngle % fullCircle;
                    return endMod !== 0;
                // end is zero
                } else if (this._endAngle === 0) {
                    startMod = this._startAngle % fullCircle;
                    return startMod !== 0;
                // both are not zero
                } else {
                    startMod = this._startAngle % fullCircle;
                    endMod = this._endAngle % fullCircle;
                    return startMod !== endMod;
                }
            }
        },

        /**
         * This shape is always continuous.
         *
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {
            return true;
        }
    });

    return Arc;
}());
