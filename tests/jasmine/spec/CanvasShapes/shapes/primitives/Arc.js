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

    describe('CanvasShapes.Arc', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1024),
                error2 = new CanvasShapes.Error(1025),
                error3 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Arc();
            }).toThrow(error1);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Arc([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Arc([[0, 0], [1, 1]]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Arc([[0, 0], [1, 1], [0, 1], [1, 1]]);
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Arc({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Arc(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Arc('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Arc(true);
            }).toThrow(error1);

            // no radius passed
            expect(function () {
                new CanvasShapes.Arc([[0, 0]]);
            }).toThrow(error2);
            expect(function () {
                new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]]);
            }).toThrow(error2);

            // wrong format of coordinates passed, all must be numbers
            expect(function () {
                new CanvasShapes.Arc([['0', '0']], 1);
            }).toThrow(error3);
            expect(function () {
                new CanvasShapes.Arc([['0', '0'], ['1', '0'], ['1', '1']], 1);
            }).toThrow(error3);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Arc([[0, 0]], 1);
                new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 1);
                new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 1, Math.PI);
                new CanvasShapes.Arc(
                    [[0, 0], [1, 0], [1, 1]],
                    1,
                    Math.PI,
                    1.5 * Math.PI
                );
                new CanvasShapes.Arc(
                    [[0, 0], [1, 0], [1, 1]],
                    1,
                    Math.PI,
                    1.5 * Math.PI,
                    true
                );
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Arc([[0, 0]], 1),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var arc = new CanvasShapes.Arc([[0, 0]], 1);

            expect(arc.MIN_COORDINATES).toBe(1);
            expect(arc.MAX_COORDINATES).toBe(3);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                arc1 = new CanvasShapes.Arc([[0, 0]], 1),
                arc2 = new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 1),
                arc3 = new CanvasShapes.Arc(
                    [[0, 0], [1, 0], [1, 1]],
                    1,
                    Math.PI
                ),
                arc4 = new CanvasShapes.Arc(
                    [[0, 0], [1, 0], [1, 1]],
                    1,
                    Math.PI,
                    1.5 * Math.PI
                ),
                arc5 = new CanvasShapes.Arc(
                    [[0, 0], [1, 0], [1, 1]],
                    1,
                    Math.PI,
                    1.5 * Math.PI,
                    true
                );

            expect(function () {
                arc1.render(layer);
                arc2.render(layer);
                arc3.render(layer);
                arc4.render(layer);
                arc5.render(layer);
            }).not.toThrow();
        });

        it('getting coordinates', function () {

            var arc1 = new CanvasShapes.Arc([[0, 0]], 1),
                arc2 = new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 1);

            expect(arc1.getCoordinates()).toEqual([[0, 0]]);
            expect(arc2.getCoordinates()).toEqual([[0, 0], [1, 0], [1, 1]]);
        });
    });
});
