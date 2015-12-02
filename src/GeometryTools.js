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

    /**
     * Measures the closest distance from a given point to a segment
     *
     * @see http://stackoverflow.com/a/6853926/571230
     *
     * @param  {array} point
     * @param  {array} lineCoordinates
     *
     * @return {floan}
     */
    function distanceToSegment(point, lineCoordinates) {

        function distance(x, y, x1, y1, x2, y2) {

            var A = x - x1;
            var B = y - y1;
            var C = x2 - x1;
            var D = y2 - y1;

            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq !== 0) //in case of 0 length line
              param = dot / len_sq;

            var xx, yy;

            if (param < 0) {
            xx = x1;
            yy = y1;
            }
            else if (param > 1) {
            xx = x2;
            yy = y2;
            }
            else {
            xx = x1 + param * C;
            yy = y1 + param * D;
            }

            var dx = x - xx;
            var dy = y - yy;

            return Math.sqrt(dx * dx + dy * dy);
        }

        return distance(
            point[0], point[1], lineCoordinates[0][0], lineCoordinates[0][1],
            lineCoordinates[1][0], lineCoordinates[1][1]
        );
    }

    /**
     * Measures the closest distance from a given point to a line
     *
     * @see https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     *
     * @param  {array} point
     * @param  {array} lineCoordinates
     *
     * @return {float}
     */
    function distanceToLine(point, lineCoordinates) {

        function distance(x0, y0, x1, y1, x2, y2) {
            return Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1) /
                Math.sqrt(Math.pow(y2-y1, 2) + Math.pow(x2-x1, 2));
        }

        return distance(
            point[0], point[1], lineCoordinates[0][0], lineCoordinates[0][1],
            lineCoordinates[1][0], lineCoordinates[1][1]
        );
    }

    /**
     * Checks whether a point lays on a line. `allowedError` allows you to
     * specify how close point should be to the line to be considered as laying
     * on it. Default is `0`.
     *
     * @param  {array}  point
     * @param  {array}  lineCoordinates
     * @param  {float}  allowedError
     *
     * @return {boolean}
     */
    function isOnTheLine(point, lineCoordinates, allowedError) {

        var distanceLine = distanceToLine(point, lineCoordinates);

        if (!allowedError) {
            allowedError = 0;
        }

        return (
            distanceLine >= 0 - allowedError &&
            distanceLine <= 0 + allowedError
        );
    }

    /**
     * Checks whether a point lays on a segment. `allowedError` allows you to
     * specify how close point should be to the line to be considered as laying
     * on it. Default is `0`.
     *
     * @param  {array}  point
     * @param  {array}  lineCoordinates
     * @param  {float}  allowedError
     *
     * @return {boolean}
     */
    function isOnTheSegment(point, lineCoordinates, allowedError) {

        var distanceSegment = distanceToSegment(point, lineCoordinates);

        if (!allowedError) {
            allowedError = 0;
        }

        return (
            distanceSegment >= 0 - allowedError &&
            distanceSegment <= 0 + allowedError
        );
    }

    return {
        angleMeasure: angleMeasure,
        segmentLength: segmentLength,
        radiansToDegrees: radiansToDegrees,
        degreesToRadians: degreesToRadians,
        isInsidePolygon: isInsidePolygon,
        distanceToLine: distanceToLine,
        distanceToSegment: distanceToSegment,
        isOnTheLine: isOnTheLine,
        isOnTheSegment: isOnTheSegment
    };
})();
