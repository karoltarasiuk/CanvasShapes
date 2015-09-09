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

    describe('CanvasShapes.Quadrilateral', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Quadrilateral();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Quadrilateral([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral(
                    [['a', 'b'], ['a', 'b'], ['a', 'b'], ['a', 'b']]
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral([0]);
            }).toThrow(error1);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Quadrilateral([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral([[0, 0], [1, 1]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Quadrilateral([[0, 0], [1, 1], [1, 0], [0, -1], [-1, 0]]);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Quadrilateral([[0, 0], [1, 1], [1, 0], [0, -1]]);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Quadrilateral([[0, 0], [1, 1], [1, 0], [0, -1]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var quadrilateral = new CanvasShapes.Quadrilateral([[0, 0], [1, 1], [1, 0], [0, -1]]);

            expect(quadrilateral.MIN_COORDINATES).toBe(4);
            expect(quadrilateral.MAX_COORDINATES).toBe(4);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                quadrilateral = new CanvasShapes.Quadrilateral([[0, 0], [1, 1], [1, 0], [0, -1]]);

            expect(function () {
                quadrilateral.render(layer);
            }).not.toThrow();
        });
    });
});
