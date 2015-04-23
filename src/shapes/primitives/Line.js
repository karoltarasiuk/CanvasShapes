/*global _, CanvasShapes*/

CanvasShapes.Line = (function () {

    /**
     * Represents a line. Accepts an array of two coordinates.
     *
     * @param {array} coordinates
     */
    var Line = function (coordinates) {
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Line.prototype, CanvasShapes.Group.prototype, {

        className: 'CanvasShapes.Line',

        initialize: function (coordinates) {

            var i;

            CanvasShapes.Group.prototype.initialize.call(this);
            this.validateCoordinatesArray(coordinates, true, 2);

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
        render: function () {

            var i,
                shapes = this.getShapes(),
                style = this.getStyle(),
                layer = this.getLayer(),
                context = layer.getContext(),
                coordinates = this.processCoordinates(
                    shapes,
                    true,
                    layer.getWidth(),
                    layer.getHeight()
                );

            for (i = 0; i < shapes.length; i++) {
                shapes[i].render();
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
