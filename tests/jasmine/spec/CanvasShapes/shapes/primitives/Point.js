/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.Point', function () {

        it('instantiating', function () {

            var error1 = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Point();
            }).toThrow(error1);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Point([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point({});
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point('string');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point(['a', 'b']);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point([['a', 'b'], ['a', 'b']]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.Point([0]);
            }).toThrow(error1);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Point([0, 0]);
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Point([0, 0]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var point1 = new CanvasShapes.Point([0, 0]);

            expect(point1.MIN_COORDINATES).toBe(1);
            expect(point1.MAX_COORDINATES).toBe(1);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                point = new CanvasShapes.Point([0, 0]);

            expect(function () {
                point.render(layer);
            }).not.toThrow();
        });

        it('getting coordinates', function () {

            var point = new CanvasShapes.Point([0, 0]);
            expect(point.getCoordinates()).toEqual([0, 0]);
        });

        it('setting scene interface handlers', function () {

            var i,
                point1 = new CanvasShapes.Point([0, 0]),
                point2 = new CanvasShapes.Point(
                    [0, 0],
                    CanvasShapes.Point.FACES.CIRCLE
                ),
                sceneInterfaceHandlers = {
                    newLayer: function () {},
                    getLayer: function () {},
                    addShape: function () {}
                };

            // there is no face, therefore it shouldn't set anything
            point1.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            expect(point1._sceneInterfaceHandlers[0])
                .toBe(sceneInterfaceHandlers);
            expect(point1._face).toBe(undefined);

            point2.setSceneInterfaceHandlers(sceneInterfaceHandlers);
            expect(point2._face._sceneInterfaceHandlers[0])
                .toBe(sceneInterfaceHandlers);

            for (i in sceneInterfaceHandlers) {

                expect(point1._sceneInterfaceHandlers[i]).toBeDefined();
                expect(point2._sceneInterfaceHandlers[i]).toBeDefined();
                expect(point2._face._sceneInterfaceHandlers[i]).toBeDefined();
                expect(point1._sceneInterfaceHandlers[0][i]).toBeDefined();
                expect(point2._sceneInterfaceHandlers[0][i]).toBeDefined();
                expect(point2._face._sceneInterfaceHandlers[0][i]).toBeDefined();

                expect(CanvasShapes._.isFunction(point1._sceneInterfaceHandlers[i]))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(point2._sceneInterfaceHandlers[i]))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(point2._face._sceneInterfaceHandlers[i]))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(point1._sceneInterfaceHandlers[0][i]))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(point2._sceneInterfaceHandlers[0][i]))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(point2._face._sceneInterfaceHandlers[0][i]))
                    .toBe(true);
            }
        });

        it('setting and getting style', function () {

            var point1 = new CanvasShapes.Point([0, 0]),
                point2 = new CanvasShapes.Point(
                    [0, 0],
                    CanvasShapes.Point.FACES.CIRCLE
                ),
                style = new CanvasShapes.Style(function (context) {
                    context.fill();
                });

            // it should return null when point doesn't have a face
            style.addToShapes(point1);
            expect(point1.getStyle()).toBe(null);

            style.addToShapes(point2);
            expect(point2.getStyle()).toBe(style);
        });

        it('setting face', function () {

            var error1 = new CanvasShapes.Error(1008),
                error2 = new CanvasShapes.Error(1026),
                point = new CanvasShapes.Point([0, 0]);

            expect(function () {
                point.setFace('circle');
                point.setFace('circle', 100);
                point.setFace('none');
                point.setFace(new CanvasShapes.Line([[0, 0], [1, 1]]));
            }).not.toThrow();

            // wrong face string passed
            expect(function () {
                point.setFace('non-existing face');
            }).toThrow(error1);

            // wrong type of face passed
            expect(function () {
                point.setFace({});
            }).toThrow(error2);
            expect(function () {
                point.setFace([]);
            }).toThrow(error2);
            expect(function () {
                point.setFace(1);
            }).toThrow(error2);
            expect(function () {
                point.setFace(true);
            }).toThrow(error2);
        });
    });
});
