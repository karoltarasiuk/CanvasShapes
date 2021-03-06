/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                polygon = new CanvasShapes.Polygon([[0, 0], [1, 1], [1, 0]]);

            expect(function () {
                polygon.render(layer);
            }).not.toThrow();
        });

        it('rendering with continue path and end point coordinates', function () {

            var beginPathSpy = jasmine.createSpy('beginPathSpy'),
                moveToSpy = jasmine.createSpy('moveToSpy'),
                lineToSpy = jasmine.createSpy('lineToSpy'),
                closePathSpy = jasmine.createSpy('closePathSpy'),
                contextStub = {
                    beginPath: function () {
                        beginPathSpy();
                    },
                    moveTo: function () {
                        moveToSpy();
                    },
                    lineTo: function () {
                        lineToSpy();
                    },
                    closePath: function () {
                        closePathSpy();
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
                shape1 = new CanvasShapes.Polygon([[0, 0], [200, 0], [200, 200]]);

            expect(function () {
                shape1.render(layer);
            }).not.toThrow();

            expect(beginPathSpy).toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(closePathSpy).toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();
            closePathSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(closePathSpy).not.toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true, [0, 0]);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(closePathSpy).not.toHaveBeenCalled();
        });

        it('isColliding method', function () {

            var scene, layer, shape1Class,
                mouseCoordinates = {},
                error = new CanvasShapes.Error(1058),
                polygon = new CanvasShapes.Polygon([[10, 10], [90, 90], [90, 10]]);

            scene = new CanvasShapes.Scene({
                element: document.createElement('div'),
                width: 100,
                height: 100
            });
            layer = scene.newLayer(polygon);

            expect(function () {
                polygon.isColliding();
            }).toThrow(error);

            expect(function () {
                polygon.isColliding({});
            }).toThrow(error);

            expect(function () {
                polygon.isColliding(false);
            }).toThrow(error);

            expect(function () {
                polygon.isColliding('string');
            }).toThrow(error);

            expect(function () {
                polygon.isColliding(1);
            }).toThrow(error);

            expect(function () {
                polygon.isColliding(function () {});
            }).toThrow(error);

            expect(function () {
                polygon.isColliding({
                    x: 1
                });
            }).toThrow(error);

            expect(function () {
                polygon.isColliding({
                    x: 1,
                    y: 1
                });
            }).toThrow(error);

            expect(function () {
                polygon.isColliding({
                    x: 1,
                    y: 1,
                    scene: {}
                });
            }).toThrow(error);

            mouseCoordinates.scene = scene;
            mouseCoordinates.x = 20;
            mouseCoordinates.y = 20;

            expect(polygon.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 20;
            mouseCoordinates.y = 23;
            expect(polygon.isColliding(mouseCoordinates)).toBe(false);

            polygon.setIsCollidingRatio(0.1);
            mouseCoordinates.x = 20;
            mouseCoordinates.y = 23;
            expect(polygon.isColliding(mouseCoordinates)).toBe(true);
        });

        it('returns undefined in `isShapeOpen` method', function () {

            var shape = new CanvasShapes.Polygon([[0, 0], [20, 20], [0, 40]]);
            expect(shape.isShapeOpen()).toBe(false);
        });

        it('returns undefined in `isShapeClosed` method', function () {

            var shape = new CanvasShapes.Polygon([[0, 0], [20, 20], [0, 40]]);
            expect(shape.isShapeClosed()).toBe(true);
        });

        it('returns true in `isShapeContinuous` method', function () {

            var shape = new CanvasShapes.Polygon([[0, 0], [20, 20], [0, 40]]);
            expect(shape.isShapeContinuous()).toBe(true);
        });
    });
});
