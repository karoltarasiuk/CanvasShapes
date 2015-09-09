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

    describe('CanvasShapes.Circle', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Circle();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Circle([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Circle({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Circle(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Circle('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Circle(true);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Circle([0, 0], 1);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Circle([0, 0], 1),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var circle = new CanvasShapes.Circle([0, 0], 1);

            expect(circle.MIN_COORDINATES).toBe(1);
            expect(circle.MAX_COORDINATES).toBe(1);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                circle = new CanvasShapes.Circle([0, 0], 1);

            expect(function () {
                circle.render(layer);
            }).not.toThrow();
        });

        it('getting coordinates', function () {

            var circle1 = new CanvasShapes.Circle([0, 0], 1),
                circle2 = new CanvasShapes.Circle([40, 120], 1);

            expect(circle1.getCoordinates()).toEqual([0, 0]);
            expect(circle2.getCoordinates()).toEqual([40, 120]);
        });
    });
});
