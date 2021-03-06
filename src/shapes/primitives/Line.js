/*global CanvasShapes*/

CanvasShapes.Line = (function () {

    var MIN_COORDINATES = 2,
        MAX_COORDINATES = 2;

    /**
     * Represents a line. Accepts an array of two coordinates.
     *
     * @param {array} coordinates
     */
    var Line = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this._initialise(coordinates);
    };

    CanvasShapes.Class.extend(Line.prototype, CanvasShapes.Shape.prototype, {

        _className: 'CanvasShapes.Line',

        /**
         * Line initialisation function. It also validates passed arguments.
         *
         * @param {array} coordinates
         */
        _initialise: function (coordinates) {

            var i;

            this.validateCoordinatesArray(
                coordinates,
                true,
                this.MIN_COORDINATES,
                this.MAX_COORDINATES
            );

            this.setCoordinates(coordinates);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer, continuePath, endPointCoordinates) {

            var i,
                style = this.getStyle(),
                context = layer.getContext(),
                coordinates = this.getRenderingCoordinates(layer);

            if (!continuePath) {
                context.beginPath();
            }

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

            context.lineTo(
                coordinates[1][0],
                coordinates[1][1]
            );

            if (!continuePath) {
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         * @override {CanvasShapes.RenderingAbstract}
         */
        getRenderingCoordinates: function (layer) {
            return this.processCoordinates(
                this.getCoordinates(), layer
            );
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         *
         * @throws {CanvasShapes.Error} 1059
         */
        isColliding: function (mouseCoordinates) {

            var layer, processedCoordinates, allowedError;

            if (
                !CanvasShapes._.isObject(mouseCoordinates) ||
                !CanvasShapes._.isNumber(mouseCoordinates.x) ||
                !CanvasShapes._.isNumber(mouseCoordinates.y) ||
                !CanvasShapes._.isObject(mouseCoordinates.scene) ||
                !CanvasShapes._.isFunction(mouseCoordinates.scene.is) ||
                !mouseCoordinates.scene.is(CanvasShapes.SceneInterface)
            ) {
                throw new CanvasShapes.Error(1059);
            }

            layer = mouseCoordinates.scene.getLayer(this);
            processedCoordinates = this.processCoordinates(
                this.getCoordinates(), layer
            );
            allowedError = this.calculateAllowedError(layer);

            return CanvasShapes.GeometryTools.isOnTheSegment(
                [mouseCoordinates.x, mouseCoordinates.y],
                processedCoordinates, allowedError
            );
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {
            return true;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {
            return true;
        }
    });

    return Line;
}());
