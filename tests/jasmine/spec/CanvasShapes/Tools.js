/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes",
    "ObjectComparer"
], function(
    _,
    CanvasShapes,
    ObjectComparer
) {

    describe('CanvasShapes.Tools', function () {

        it('angle measure method', function () {

            var i,
                points = [
                    { p1: [0, 0], p2: [0, 3], p3: [4, 0], d: 90 },
                    // ADD MORE
                ];

            for (i = 0; i < points.length; i++) {
                expect(CanvasShapes.Tools.angleMeasure(
                    points[i].p1,
                    points[i].p2,
                    points[i].p3
                )).toBe(points[i].d);
            }
        });

        it('radians to degrees method and back', function () {

            var i,
                values = [
                    { d: 360, r: 2*Math.PI },
                    { d: 180, r: Math.PI },
                    { d: 90, r: Math.PI/2 },
                    { d: 45, r: Math.PI/4 },
                    { d: 9, r: Math.PI/20 },
                    { d: 3, r: Math.PI/60 },
                    { d: 1, r: Math.PI/180 }
                ];

            for (i = 0; i < values.length; i++) {
                expect(CanvasShapes.Tools.degreesToRadians(values[i].d)).toBe(values[i].r);
                expect(CanvasShapes.Tools.radiansToDegrees(values[i].r)).toBe(values[i].d);
            }
        });

        it('segment length method', function () {

            var i,
                points = [
                    { p1: [0, 3], p2: [4, 0], l: 5 },
                    { p1: [0, 2], p2: [1, 0], l: Math.sqrt(5) }
                ];

            for (i = 0; i < points.length; i++) {
                expect(CanvasShapes.Tools.segmentLength(
                    points[i].p1,
                    points[i].p2
                )).toBe(points[i].l);
            }
        });
    });
});
