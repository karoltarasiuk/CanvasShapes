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

    return {
        angleMeasure: angleMeasure,
        segmentLength: segmentLength,
        radiansToDegrees: radiansToDegrees,
        degreesToRadians: degreesToRadians
    };
})();
