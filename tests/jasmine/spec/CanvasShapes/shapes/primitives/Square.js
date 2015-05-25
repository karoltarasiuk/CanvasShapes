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

    describe('CanvasShapes.Square', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011),
                error2 = new CanvasShapes.Error(1013),
                error3 = new CanvasShapes.Error(1015);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Square();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Square([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square(
                    [['a', 'b'], ['a', 'b'], ['a', 'b'], ['a', 'b']]
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square([0]);
            }).toThrow(error1);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Square([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square([[0, 0], [1, 1]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Square([[0, 0], [1, 1], [1, 0], [0, -1], [-1, 0]]);
            }).toThrow(error1);

            // points don't create equal segments
            expect(function () {
                new CanvasShapes.Square([[0, 0], [2, 1], [2, 0]]);
            }).toThrow(error3);

            // points don't create 90 degrees angle
            expect(function () {
                new CanvasShapes.Square([[0, 0], [3, 1], [6, 0]]);
            }).toThrow(error2);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Square([[0, 0], [1, 1], [2, 0]]);
            }).not.toThrow();
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                Square = new CanvasShapes.Square([[0, 0], [1, 1], [2, 0]]);

            expect(function () {
                Square.render(layer);
            }).not.toThrow();
        });
    });
});
