/*global _, CanvasShapes*/

CanvasShapes.Rectangle = (function () {

    /**
     * Represents a rectangle. You need to pass an array of 3 coordinates, which
     * must create a 90 degress angle. Second coordinate should be a vertex of
     * an angle.
     *
     * @param {array} coordinates
     */
    var Rectangle = function (coordinates) {
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Rectangle.prototype, CanvasShapes.Quadrilateral.prototype, {

        className: 'CanvasShapes.Rectangle',

        initialize: function (coordinates) {

            var angle, processedCoordinates,
                point = [];

            this.validateCoordinatesArray(coordinates, true, 3);
            processedCoordinates = this.processCoordinates(coordinates, true);

            angle = CanvasShapes.Tools.angleMeasure(
                processedCoordinates[1],
                processedCoordinates[2],
                processedCoordinates[0]
            );

            if (angle !== 90) {
                throw new CanvasShapes.Error(1013);
            }

            point[0] = processedCoordinates[0][0] + processedCoordinates[2][0] -
                processedCoordinates[1][0];
            point[1] = processedCoordinates[0][1] + processedCoordinates[2][1] -
                processedCoordinates[1][1];

            coordinates.push(point);

            CanvasShapes.Polygon.prototype.initialize.call(this, coordinates);
        }
    });

    return Rectangle;
}());
