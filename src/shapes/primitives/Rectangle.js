/*global CanvasShapes*/

CanvasShapes.Rectangle = (function () {

    var MIN_COORDINATES = 3,
        MAX_COORDINATES = 3;

    /**
     * Represents a rectangle. You need to pass an array of 3 coordinates, which
     * must create a 90 degress angle. Second coordinate should be an apex of
     * a 90 degrees angle.
     *
     * @param {array} coordinates
     */
    var Rectangle = function (coordinates) {
        this.setUUID();
        this.MIN_COORDINATES = MIN_COORDINATES;
        this.MAX_COORDINATES = MAX_COORDINATES;
        this._initialise(coordinates);
    };

    CanvasShapes.Class.extend(
        Rectangle.prototype,
        CanvasShapes.Quadrilateral.prototype,
    {
        _className: 'CanvasShapes.Rectangle',

        /**
         * Recangle initialisation method. It also validates arguments.
         *
         * @throws {CanvasShapes.Error} 1013
         *
         * @param {array} coordinates
         */
        _initialise: function (coordinates) {

            var angle, processedCoordinates,
                point = [];

            this.validateCoordinatesArray(
                coordinates,
                true,
                this.MIN_COORDINATES,
                this.MAX_COORDINATES
            );
            processedCoordinates = this.processCoordinates(coordinates);

            angle = CanvasShapes.GeometryTools.angleMeasure(
                processedCoordinates[0],
                processedCoordinates[1],
                processedCoordinates[2]
            );

            if (
                Math.abs(angle - 90) >
                CanvasShapes.Config.get('EQUALITY_ALLOWED_ERROR')
            ) {
                throw new CanvasShapes.Error(1013);
            }

            point[0] = processedCoordinates[0][0] + processedCoordinates[2][0] -
                processedCoordinates[1][0];
            point[1] = processedCoordinates[0][1] + processedCoordinates[2][1] -
                processedCoordinates[1][1];

            coordinates.push(point);

            // I have added new coordinate to the array, and now 4 is valid
            // I need to adjust the numbers, as polygon initialisation will
            // validate them again.
            this.MAX_COORDINATES++;
            this.MIN_COORDINATES++;
            CanvasShapes.Polygon.prototype._initialise.call(this, coordinates);
        }
    });

    return Rectangle;
}());
