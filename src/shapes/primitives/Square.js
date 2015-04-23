/*global _, CanvasShapes*/

CanvasShapes.Square = (function () {

    /**
     * Represents a rectangle. You need to pass an array of 3 coordinates, which
     * must create a 90 degress angle. Two segments created by those coordinates
     * must be equal in length. Second coordinate should be a vertex of
     * an angle.
     *
     * @param {array} coordinates
     */
    var Square = function (coordinates) {
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Square.prototype, CanvasShapes.Rectangle.prototype, {

        className: 'CanvasShapes.Square',

        initialize: function (coordinates) {

            var temp1, temp2, processedCoordinates;

            this.validateCoordinatesArray(coordinates, true, 3);
            processedCoordinates = this.processCoordinates(coordinates, true);

            temp1 = CanvasShapes.Tools.segmentLength(
                processedCoordinates[0],
                processedCoordinates[1]
            );

            temp2 = CanvasShapes.Tools.segmentLength(
                processedCoordinates[1],
                processedCoordinates[2]
            );

            if (temp1 !== temp2) {
                throw new CanvasShapes.Error(1014);
            }

            CanvasShapes.Rectangle.prototype.initialize.call(this, coordinates);
        }
    });

    return Square;
}());
