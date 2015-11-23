/*global _, CanvasShapes*/

CanvasShapes.GeometryTools = (function () {

    /**
     * Calculates the measure of an angle based on 3 points creating it. By
     * default it returns measure in degrees but it can return it in radians. To
     * do so simply pass `true` as fourth parameter. Coordinates of a point are
     * arrays in the following format: `[x, y]`.
     *
     * From law of cosines: http://en.wikipedia.org/wiki/Law_of_cosines
     *
     * @param {array}   p1      coordinates
     * @param {array}   p2      coordinates of apex
     * @param {array}   p3      coordinates
     * @param {boolean} radians [OPTIONAL]
     *
     * @return {float}
     */
    function angleMeasure (p1, p2, p3, radians) {

        var a = segmentLength(p2, p1),
            b = segmentLength(p2, p3),
            c = segmentLength(p1, p3),
            r = Math.acos(
                (a * a + b * b - c * c) / (2 * a * b)
            );

        if (radians === true) {
            return r;
        }

        return radiansToDegrees(r);
    }

    /**
     * Converts degrees measure to radians.
     *
     * @param  {float} degress
     * @return {float}
     */
    function degreesToRadians (degress) {
        return degress * Math.PI / 180;
    }

    /**
     * Converts radians measure to degrees.
     *
     * @param  {float} radians
     * @return {float}
     */
    function radiansToDegrees (radians) {
        return radians * 180 / Math.PI;
    }

    /**
     * Calculates a length of a segment defined by two points. Coordinates of a
     * point are arrays in the following format: `[x, y]`.
     *
     * @param  {array} p1 coordinates
     * @param  {array} p2 coordinates
     *
     * @return {float}
     */
    function segmentLength(p1, p2) {

        return Math.sqrt(
            Math.pow(p1[0] - p2[0], 2) +
            Math.pow(p1[1] - p2[1], 2)
        );
    }

    /**
     * Checks whether passed point lays within a polygon. Based on ray-casting
     * algorithm.
     *
     * @see http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @source https://github.com/substack/point-in-polygon
     *
     * @param  {[type]}  point              [description]
     * @param  {[type]}  polygonCoordinates [description]
     * @return {Boolean}                    [description]
     */
    function isInsidePolygon(point, polygonCoordinates) {

        var i, j, xi, xj, yi, yj, intersect,
            x = point[0], y = point[1],
            inside = false;

        for (
            i = 0,
            j = polygonCoordinates.length - 1;
            i < polygonCoordinates.length;
            j = i++
        ) {
            xi = polygonCoordinates[i][0], yi = polygonCoordinates[i][1];
            xj = polygonCoordinates[j][0], yj = polygonCoordinates[j][1];
            intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    return {
        angleMeasure: angleMeasure,
        segmentLength: segmentLength,
        radiansToDegrees: radiansToDegrees,
        degreesToRadians: degreesToRadians,
        isInsidePolygon: isInsidePolygon
    };
})();
