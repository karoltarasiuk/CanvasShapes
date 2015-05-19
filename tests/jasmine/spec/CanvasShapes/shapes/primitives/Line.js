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

    describe('CanvasShapes.Line', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Line();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Line([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line([['a', 'b'], ['a', 'b']]);
            }).toThrow(error1);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Line([[0, 0]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Line([[0, 0], [1, 1], [2, 2]]);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Line([[0, 0], [1, 1]]);
            }).not.toThrow();
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 }),
                layer = new CanvasShapes.SceneLayer(scene),
                line = new CanvasShapes.Line([[0, 0], [1, 1]]);

            expect(function () {
                line.render(layer);
            }).not.toThrow();
        });
    });
});
