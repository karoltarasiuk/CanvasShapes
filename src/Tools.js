/*global _, CanvasShapes*/

CanvasShapes.Tools = (function () {

    /**
     * From law of cosines: http://en.wikipedia.org/wiki/Law_of_cosines
     */
    function angleMeasure (p1, p2, p3, radians) {

        var a = segmentLength(p1, p2),
            b = segmentLength(p1, p3),
            c = segmentLength(p2, p3),
            r = Math.acos(
                (a * a + b * b - c * c) / (2 * a * b)
            );

        if (radians === true) {
            return r;
        }

        return radiansToDegree(r);
    }

    function degreesToRadians (degress) {
        return degress * Math.PI / 180;
    }

    function radiansToDegree (radians) {
        return radians * 180 / Math.PI;
    }

    function segmentLength(p1, p2) {

        return Math.sqrt(
            Math.pow(p1[0] - p2[0], 2) +
            Math.pow(p1[1] - p2[1], 2)
        );
    }

    return {
        angleMeasure: angleMeasure,
        segmentLength: segmentLength,
        radiansToDegree: radiansToDegree,
        degreesToRadians: degreesToRadians
    };
})();
