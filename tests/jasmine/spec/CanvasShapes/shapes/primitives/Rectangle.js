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

    describe('CanvasShapes.Rectangle', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011),
                error2 = new CanvasShapes.Error(1013);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Rectangle();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Rectangle([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle(
                    [['a', 'b'], ['a', 'b'], ['a', 'b'], ['a', 'b']]
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle([0]);
            }).toThrow(error1);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Rectangle([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle([[0, 0], [1, 1]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Rectangle([[0, 0], [1, 1], [1, 0], [0, -1], [-1, 0]]);
            }).toThrow(error1);

            // points don't create 90 degrees angle
            expect(function () {
                new CanvasShapes.Rectangle([[0, 0], [2, 1], [2, 0]]);
            }).toThrow(error2);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Rectangle([[0, 0], [1, 1], [2, 0]]);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Rectangle([[0, 0], [1, 1], [2, 0]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var rectangle = new CanvasShapes.Rectangle([[0, 0], [1, 1], [2, 0]]);

            // after initialisation those numbers are adjusted, 3 is good when
            // creating
            expect(rectangle.MIN_COORDINATES).toBe(4);
            expect(rectangle.MAX_COORDINATES).toBe(4);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                rectangle = new CanvasShapes.Rectangle([[0, 0], [1, 1], [2, 0]]);

            expect(function () {
                rectangle.render(layer);
            }).not.toThrow();
        });
    });
});
