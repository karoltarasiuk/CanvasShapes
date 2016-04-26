/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.Line([[0, 0], [1, 1]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var line = new CanvasShapes.Line([[0, 0], [1, 1]]);

            expect(line.MIN_COORDINATES).toBe(2);
            expect(line.MAX_COORDINATES).toBe(2);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                line = new CanvasShapes.Line([[0, 0], [1, 1]]);

            expect(function () {
                line.render(layer);
            }).not.toThrow();
        });

        it('rendering with continue path and end point coordinates', function () {

            var beginPathSpy = jasmine.createSpy('beginPathSpy'),
                moveToSpy = jasmine.createSpy('moveToSpy'),
                lineToSpy = jasmine.createSpy('lineToSpy'),
                contextStub = {
                    beginPath: function () {
                        beginPathSpy();
                    },
                    moveTo: function () {
                        moveToSpy();
                    },
                    lineTo: function () {
                        lineToSpy();
                    }
                },
                layer = {
                    getUUID: function () {
                        return 'UUID';
                    },
                    getWidth: function () {
                        return 200;
                    },
                    getHeight: function () {
                        return 200;
                    },
                    getContext: function () {
                        return contextStub;
                    }
                },
                shape1 = new CanvasShapes.Line([[0, 0], [200, 0]]);

            expect(function () {
                shape1.render(layer);
            }).not.toThrow();

            expect(beginPathSpy).toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true, [0, 0]);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
        });

        it('isColliding method', function () {

            var scene, layer, shape1Class,
                mouseCoordinates = {},
                error = new CanvasShapes.Error(1059),
                line = new CanvasShapes.Line([[10, 10], [90, 90]]);

            scene = new CanvasShapes.Scene({
                element: document.createElement('div'),
                width: 100,
                height: 100
            });
            layer = scene.newLayer(line);

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
            mouseCoordinates.x = 20;
            mouseCoordinates.y = 20;

            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 20;
            mouseCoordinates.y = 22;
            expect(line.isColliding(mouseCoordinates)).toBe(false);

            line.setIsCollidingRatio(0.1);
            mouseCoordinates.x = 20;
            mouseCoordinates.y = 22;
            expect(line.isColliding(mouseCoordinates)).toBe(true);
        });

        it('returns undefined in `isShapeOpen` method', function () {

            var shape = new CanvasShapes.Line([[0, 0], [20, 20]]);
            expect(shape.isShapeOpen()).toBe(true);
        });

        it('returns undefined in `isShapeClosed` method', function () {

            var shape = new CanvasShapes.Line([[0, 0], [20, 20]]);
            expect(shape.isShapeClosed()).toBe(false);
        });

        it('returns true in `isShapeContinuous` method', function () {

            var shape = new CanvasShapes.Line([[0, 0], [20, 20]]);
            expect(shape.isShapeContinuous()).toBe(true);
        });
    });
});
