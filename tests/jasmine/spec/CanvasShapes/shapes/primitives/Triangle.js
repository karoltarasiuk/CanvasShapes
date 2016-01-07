/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes"
], function(
    _,
    CanvasShapes
) {

    describe('CanvasShapes.Triangle', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Triangle();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Triangle([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle([['a', 'b'], ['a', 'b'], ['a', 'b']]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle([0]);
            }).toThrow(error1);

            // not enough of coordinates passed
            expect(function () {
                new CanvasShapes.Triangle([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Triangle([[0, 0], [1, 1]]);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Triangle([[0, 0], [1, 1], [1, 0]]);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Triangle([[0, 0], [1, 1], [1, 0]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var triangle = new CanvasShapes.Triangle([[0, 0], [1, 1], [1, 0]]);

            expect(triangle.MIN_COORDINATES).toBe(3);
            expect(triangle.MAX_COORDINATES).toBe(3);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                triangle = new CanvasShapes.Triangle([[0, 0], [1, 1], [1, 0]]);

            expect(function () {
                triangle.render(layer);
            }).not.toThrow();
        });
    });
});
