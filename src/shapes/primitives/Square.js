/*global _, CanvasShapes*/

CanvasShapes.Square = (function () {

    var MIN_COORDINATES = 3,
        MAX_COORDINATES = 3;

    /**
     * Represents a rectangle. You need to pass an array of 3 coordinates, which
     * must create a 90 degress angle. Two segments created by those coordinates
     * must be equal in length. Second coordinate should be a vertex of
     * an angle.
     *
     * @param {array} coordinates
     */
    var Square = function (coordinates) {
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this.initialize(coordinates);
    };

    CanvasShapes.Class.extend(Square.prototype, CanvasShapes.Rectangle.prototype, {

        className: 'CanvasShapes.Square',

        initialize: function (coordinates) {

            var temp1, temp2, processedCoordinates;

            this.validateCoordinatesArray(
                coordinates,
                true,
                this.MIN_COORDINATES,
                this.MAX_COORDINATES
            );
            processedCoordinates = this.processCoordinates(coordinates, true);

            temp1 = CanvasShapes.GeometryTools.segmentLength(
                processedCoordinates[0],
                processedCoordinates[1]
            );

            temp2 = CanvasShapes.GeometryTools.segmentLength(
                processedCoordinates[1],
                processedCoordinates[2]
            );

            if (temp1 !== temp2) {
                throw new CanvasShapes.Error(1015);
            }

            CanvasShapes.Rectangle.prototype.initialize.call(this, coordinates);
        }
    });

    return Square;
}());
