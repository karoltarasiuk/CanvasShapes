/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.Relation', function () {

        it('instantiating', function () {

            var error = new CanvasShapes.Error(1072);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.Relation();
            }).toThrow(error);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.Relation([]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation([[0, 0], [1, 1]]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation([[0, 0]]);
            }).toThrow(error);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.Relation({});
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation(1);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation('string');
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation(true);
            }).toThrow(error);

            // wrong format of coordinates passed, all must be numbers
            expect(function () {
                new CanvasShapes.Relation([['0', '0']]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.Relation([['0', '0'], ['1', '0'], ['1', '1']]);
            }).toThrow(error);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.Relation(
                    function () { return []; }
                );
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Relation(function () { return []; }),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                shape1 = new CanvasShapes.Relation(
                    function () { return []; }
                ),
                shape2 = new CanvasShapes.Relation(
                    function () { return [1]; }
                ),
                shape3 = new CanvasShapes.Relation(
                    function (x) { return [x, 2*x, x*x]; }
                );

            expect(function () {
                shape1.render(layer);
                shape2.render(layer);
                shape3.render(layer);
            }).not.toThrow();
        });

        it('isColliding method', function () {

            var scene, layer, shape1Class,
                mouseCoordinates = {},
                error = new CanvasShapes.Error(1070),
                line = new CanvasShapes.Relation(
                    function () { return [10]; }
                ),
                line2 = new CanvasShapes.Relation(
                    function (x) { if (x === 10) return [10]; else return [false]; }
                ),
                style = new CanvasShapes.Style({
                    strokeStyle: 'darkBlue',
                    lineWidth: 5
                });

            scene = new CanvasShapes.Scene({
                element: document.createElement('div'),
                width: 100,
                height: 100
            });
            layer = scene.newLayer(line);
            scene.addShape(line2, layer);
            line.setRelativeRendering(true);
            line2.setRelativeRendering(true);
            style.addToShapes(line);

            expect(function () {
                line.isColliding();
            }).toThrow(error);

            expect(function () {
                line.isColliding({});
            }).toThrow(error);

            expect(function () {
                line.isColliding(false);
            }).toThrow(error);

            expect(function () {
                line.isColliding('string');
            }).toThrow(error);

            expect(function () {
                line.isColliding(1);
            }).toThrow(error);

            expect(function () {
                line.isColliding(function () {});
            }).toThrow(error);

            expect(function () {
                line.isColliding({
                    x: 1
                });
            }).toThrow(error);

            expect(function () {
                line.isColliding({
                    x: 1,
                    y: 1
                });
            }).toThrow(error);

            expect(function () {
                line.isColliding({
                    x: 1,
                    y: 1,
                    scene: {}
                });
            }).toThrow(error);

            mouseCoordinates.scene = scene;
            mouseCoordinates.x = 0;
            mouseCoordinates.y = 90;

            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 0;
            mouseCoordinates.y = 91;
            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 0;
            mouseCoordinates.y = 93.6;
            expect(line.isColliding(mouseCoordinates)).toBe(false);

            line.setIsCollidingRatio(0.1);
            mouseCoordinates.x = 0;
            mouseCoordinates.y = 80;
            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 0;
            mouseCoordinates.y = 77.4;
            expect(line.isColliding(mouseCoordinates)).toBe(false);

            mouseCoordinates.x = 10;
            mouseCoordinates.y = 90;
            expect(line2.isColliding(mouseCoordinates)).toBe(true);

            line2.setIsCollidingRatio(0.1);
            mouseCoordinates.x = 10;
            mouseCoordinates.y = 80;
            expect(line2.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 10;
            mouseCoordinates.y = 79;
            expect(line2.isColliding(mouseCoordinates)).toBe(false);

            line2.setIsCollidingRatio(0);
            mouseCoordinates.x = 9;
            mouseCoordinates.y = 90;
            expect(line2.isColliding(mouseCoordinates)).toBe(false);

            mouseCoordinates.x = 11;
            mouseCoordinates.y = 90;
            expect(line2.isColliding(mouseCoordinates)).toBe(false);

            mouseCoordinates.x = 10;
            mouseCoordinates.y = 90;
            expect(line2.isColliding(mouseCoordinates)).toBe(true);
        });
    });
});
