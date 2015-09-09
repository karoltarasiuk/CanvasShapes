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

    CanvasShapes.Class.extend(Line.prototype, CanvasShapes.Group.prototype, {

        className: 'CanvasShapes.Line',

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
            context.lineTo(
                coordinates[1][0],
                coordinates[1][1]
            );

            context.closePath();
            style.set(layer);
        }
    });

    return Line;
}());
