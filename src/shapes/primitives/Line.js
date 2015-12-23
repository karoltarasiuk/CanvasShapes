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
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.initialise(coordinates);
    };

    CanvasShapes.Class.extend(Line.prototype, CanvasShapes.Shape.prototype, {

        className: 'CanvasShapes.Line',

        initialise: function (coordinates) {

            this.initialiseShapeConstants();

            coordinates = this.convertCoordinatesObjects(coordinates);

            this.validateCoordinates(
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
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        toJSON: function (toString) {

            var obj = {
                    metadata: {
                        className: this.className,
                        UUID: this.getUUID()
                    },
                    data: {
                        coordinates: this.getCoordinates()
                    }
                };

            if (toString === true) {
                obj = JSON.stringify(obj);
            }

            return obj;
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        fromJSON: function (obj) {

            var line;

            if (_.isString(obj)) {
                obj = JSON.parse(obj);
            }

            if (
                !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
                !_.isString(obj.metadata.className) ||
                !_.isString(obj.metadata.UUID) ||
                (obj.data.coordinates && !_.isArray(obj.data.coordinates))
            ) {
                throw new CanvasShapes.Error(1063);
            }
// STYLE!!!!!!!
            line = new CanvasShapes.Line(obj.data.coordinates);
            CanvasShapes.Class.swapUUID(line.getUUID(), obj.metadata.UUID);

            return line;
        }
    });

    return Line;
}());
