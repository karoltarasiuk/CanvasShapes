/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes"
], function(
    _,
    CanvasShapes
) {

    describe('CanvasShapes.GeometryTools', function () {

        it('angle measure method', function () {

            var i,
                points = [
                    { p1: [0, 3], p2: [0, 0], p3: [4, 0], d: 90 },
                    { p1: [0, 0], p2: [1, 1], p3: [2, 0], d: 90 },
                    { p1: [0, 0], p2: [1, -1], p3: [2, 0], d: 90 },
                    { p1: [0, 0], p2: [0, 1], p3: [1, 0], d: 45 },
                    { p1: [0, 0], p2: [0, -1], p3: [1, 0], d: 45 },
                ];

            for (i = 0; i < points.length; i++) {
                expect(
                    Math.abs(
                        CanvasShapes.GeometryTools.angleMeasure(
                            points[i].p1,
                            points[i].p2,
                            points[i].p3
                        ) - points[i].d
                    ) < CanvasShapes.Config.get('EQUALITY_ALLOWED_ERROR')
                ).toBe(true);
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
                expect(CanvasShapes.GeometryTools.degreesToRadians(values[i].d))
                    .toBe(values[i].r);
                expect(CanvasShapes.GeometryTools.radiansToDegrees(values[i].r))
                    .toBe(values[i].d);
            }
        });

        it('segment length method', function () {

            var i,
                points = [
                    { p1: [0, 3], p2: [4, 0], l: 5 },
                    { p1: [0, 2], p2: [1, 0], l: Math.sqrt(5) }
                ];

            for (i = 0; i < points.length; i++) {
                expect(CanvasShapes.GeometryTools.segmentLength(
                    points[i].p1,
                    points[i].p2
                )).toBe(points[i].l);
            }
        });

        it('is on the line', function () {

            var i,
                specs = [{
                    line: [[2, 2], [-2, -2]],
                    point: [0, 0]
                }, {
                    line: [[2, 2], [-2, -2]],
                    point: [5, 5]
                }, {
                    line: [[2, 2], [0, 1]],
                    point: [-2, 0]
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.isOnTheLine(
                    specs[i].point, specs[i].line
                )).toBe(true);
            }
        });

        it('is not on the line', function () {

            var i,
                specs = [{
                    line: [[2, 2], [-2, -2]],
                    point: [0, 1]
                }, {
                    line: [[2, 2], [-2, -2]],
                    point: [6, 5]
                }, {
                    line: [[2, 2], [0, 1]],
                    point: [-3, 0]
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.isOnTheLine(
                    specs[i].point, specs[i].line
                )).toBe(false);
            }
        });

        it('is on the line with allowed error', function () {

            var i,
                specs = [{
                    line: [[-1.359, 0], [0, 3.18]],
                    point: [1.1, 5.754],
                    error: 0.001
                }, {
                    line: [[-1.359, 0], [0, 3.18]],
                    point: [1.1, 5.7],
                    error: 0.1
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.isOnTheLine(
                    specs[i].point, specs[i].line, specs[i].error
                )).toBe(true);
            }
        });

        it('is on the segment', function () {

            var i,
                specs = [{
                    line: [[2, 2], [-2, -2]],
                    point: [0, 0]
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [0, 1]
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.isOnTheSegment(
                    specs[i].point, specs[i].line
                )).toBe(true);
            }
        });

        it('is on the segment with allowed error', function () {

            var i,
                specs = [{
                    line: [[-1.359, 0], [0, 3.18]],
                    point: [-1.02, 0.793],
                    error: 0.001
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.isOnTheSegment(
                    specs[i].point, specs[i].line, specs[i].error
                )).toBe(true);
            }
        });

        it('measures distance to the line', function () {

            var i,
                specs = [{
                    line: [[2, 2], [-2, -2]],
                    point: [0, 0],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [2, 2],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [-2, 0],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [-5, -1.5],
                    distance: 0
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.distanceToLine(
                    specs[i].point, specs[i].line
                )).toBe(specs[i].distance);
            }
        });

        it('measures distance to the segment', function () {

            var i,
                specs = [{
                    line: [[2, 2], [-2, -2]],
                    point: [0, 0],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [2, 2],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [-2, 0],
                    distance: 0
                }, {
                    line: [[2, 2], [-2, 0]],
                    point: [1, 1.5],
                    distance: 0
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.GeometryTools.distanceToSegment(
                    specs[i].point, specs[i].line
                )).toBe(specs[i].distance);
            }
        });
    });
});
