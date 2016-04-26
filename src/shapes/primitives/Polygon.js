/*global CanvasShapes*/

CanvasShapes.Polygon = (function () {

    var MIN_COORDINATES = 3,
        MAX_COORDINATES = undefined;

    /**
     * Represents a polygon. Accepts an array of any number of coordinates, but
     * three is minimum.
     *
     * @param {array} coordinates
     */
    var Polygon = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this._initialise(coordinates);
    };

    CanvasShapes.Class.extend(Polygon.prototype, CanvasShapes.Shape.prototype, {

        _className: 'CanvasShapes.Polygon',

        /**
         * Polygon initialisation method. It also validates arguments.
         *
         * @param {array} coordinates
         */
        _initialise: function (coordinates) {

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
                coordinates = this.processCoordinates(
                    this.getCoordinates(), layer
                );

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

            for (i = 1; i <= coordinates.length; i++) {

                if (i === coordinates.length) {
                    i = 0;
                }

                context.lineTo(
                    coordinates[i][0],
                    coordinates[i][1]
                );

                if (i === 0) break;
            }

            if (!continuePath) {
                context.closePath();
                style.set(layer, this.getRelativeRendering());
            }
        },

        /**
         * Due to the complexity of calculations allowedError in
         * CanvasShapes.Polygon applies to the position of a point, and not to
         * the distance to its edge.
         *
         * @throws {CanvasShapes.Error} 1058
         *
         * @implements {CanvasShapes.InteractionInterface}
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
                throw new CanvasShapes.Error(1058);
            }

            layer = mouseCoordinates.scene.getLayer(this);
            processedCoordinates = this.processCoordinates(
                this.getCoordinates(), layer
            );
            allowedError = this.calculateAllowedError(layer);

            return CanvasShapes.GeometryTools.isInsidePolygon(
                [mouseCoordinates.x, mouseCoordinates.y],
                processedCoordinates, allowedError
            );
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeOpen: function () {
            return false;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         * @overrides {CanvasShapes.ShapeAbstract}
         */
        isShapeContinuous: function () {
            return true;
        }
    });

    return Polygon;
}());
