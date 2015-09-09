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

    describe('CanvasShapes.Polygon', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Polygon();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Polygon([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon([['a', 'b'], ['a', 'b'], ['a', 'b']]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon([0]);
            }).toThrow(error1);

            // not enough of coordinates passed
            expect(function () {
                new CanvasShapes.Polygon([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Polygon([[0, 0], [1, 1]]);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0]]);
                new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0], [0, -1]]);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0], [0, -1]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var polygon = new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0]]);

            expect(polygon.MIN_COORDINATES).toBe(3);
            expect(polygon.MAX_COORDINATES).toBeUndefined();
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                polygon = new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0]]);

            expect(function () {
                polygon.render(layer);
            }).not.toThrow();
        });
    });
});
