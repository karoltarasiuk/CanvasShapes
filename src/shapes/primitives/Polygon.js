/*global _, CanvasShapes*/

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
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Polygon.prototype, CanvasShapes.Group.prototype, {

        className: 'CanvasShapes.Polygon',

        initialize: function (coordinates) {

            var i;

            CanvasShapes.Group.prototype.initialize.call(this);
            this.validateCoordinatesArray(
                coordinates,
                true,
                this.MIN_COORDINATES,
                this.MAX_COORDINATES
            );

            for (i = 0; i < coordinates.length; i++) {
                if (_.isArray(coordinates[i])) {
                    this.addShapes(new CanvasShapes.Point(coordinates[i]));
                } else {
                    this.addShapes(coordinates[i]);
                }
            }
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        render: function (layer) {

            var i,
                shapes = this.getShapes(),
                style = this.getStyle(),
                context = layer.getContext(),
                coordinates = this.processCoordinates(
                    shapes, true, layer
                );

            for (i = 0; i < shapes.length; i++) {
                shapes[i].render(layer);
            }

            context.beginPath();

            context.moveTo(
                coordinates[0][0],
                coordinates[0][1]
            );

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

            context.closePath();
            style.set(layer);
        }
    });

    return Polygon;
}());
