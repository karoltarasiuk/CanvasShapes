/*global _, CanvasShapes*/

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
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Line.prototype, CanvasShapes.Shape.prototype, {

        className: 'CanvasShapes.Line',

        initialize: function (coordinates) {

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
        render: function (layer) {

            var i,
                style = this.getStyle(),
                context = layer.getContext(),
                coordinates = this.processCoordinates(
                    this.getCoordinates(), layer
                );

            context.beginPath();

            context.moveTo(
                coordinates[0][0],
                coordinates[0][1]
            );
            context.lineTo(
                coordinates[1][0],
                coordinates[1][1]
            );

            context.closePath();
            style.set(layer);
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        isColliding: function (mouseCoordinates) {

            var layer, processedCoordinates, allowedError;

            if (
                !_.isObject(mouseCoordinates) ||
                !_.isNumber(mouseCoordinates.x) ||
                !_.isNumber(mouseCoordinates.y) ||
                !_.isObject(mouseCoordinates.scene) ||
                !_.isFunction(mouseCoordinates.scene.is) ||
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
        }
    });

    return Line;
}());
