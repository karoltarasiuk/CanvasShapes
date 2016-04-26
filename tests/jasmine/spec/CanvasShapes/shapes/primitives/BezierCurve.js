/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.BezierCurve', function () {

        it('instantiating', function () {

            var error = new CanvasShapes.Error(1011);

            // no coordinates passed
            expect(function () {
                new CanvasShapes.BezierCurve();
            }).toThrow(error);

            // wrong number of coordinates passed
            expect(function () {
                new CanvasShapes.BezierCurve([]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve([[0, 0], [1, 1]]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve([[0, 0]]);
            }).toThrow(error);

            // wrong format of coordinates passed
            expect(function () {
                new CanvasShapes.BezierCurve({});
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve(1);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve('string');
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve(true);
            }).toThrow(error);

            // wrong format of coordinates passed, all must be numbers
            expect(function () {
                new CanvasShapes.BezierCurve([['0', '0']]);
            }).toThrow(error);
            expect(function () {
                new CanvasShapes.BezierCurve([['0', '0'], ['1', '0'], ['1', '1']]);
            }).toThrow(error);

            // all good with initialisation
            expect(function () {
                new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5]]
                );
                new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5], [10, 10]]
                );
                new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5], [10, 10], [50, 50]]
                );
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.BezierCurve([[0, 0], [1, 1], [5, 5]]),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('correctly sets min and max coordinates variables', function () {

            var arc = new CanvasShapes.BezierCurve([[0, 0], [1, 1], [5, 5]]);

            expect(arc.MIN_COORDINATES).toBe(3);
            expect(arc.MAX_COORDINATES).toBe(undefined);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                shape1 = new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5]]
                ),
                shape2 = new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5], [10, 10]]
                ),
                shape3 = new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5], [10, 10], [50, 50]]
                );

            expect(function () {
                shape1.render(layer);
                shape2.render(layer);
                shape3.render(layer);
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
                shape1 = new CanvasShapes.BezierCurve([[0, 0], [200, 0], [200, 200]]);

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

        it('getting grade', function () {

            var shape1 = new CanvasShapes.BezierCurve([[0, 0], [1, 1], [5, 5]]),
                shape2 = new CanvasShapes.BezierCurve(
                    [[0, 0], [1, 1], [5, 5], [10, 10], [50, 50]]
                );

            expect(shape1.getGrade()).toEqual(1);
            expect(shape2.getGrade()).toEqual(3);
        });

        it('isColliding method', function () {

            var scene, layer, shape1Class,
                mouseCoordinates = {},
                error = new CanvasShapes.Error(1070),
                line = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [50, 100]
                ]),
                closedCurve = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [0, 0]
                ]),
                style = new CanvasShapes.Style({
                    strokeStyle: 'darkBlue',
                    lineWidth: 5
                });

            scene = new CanvasShapes.Scene({
                element: document.createElement('div'),
                width: 405,
                height: 405
            });
            layer = scene.newLayer(line);
            scene.addShape(closedCurve, layer);
            line.setRelativeRendering(true);
            closedCurve.setRelativeRendering(true);
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
            mouseCoordinates.y = 0;

            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 202.5;
            mouseCoordinates.y = 405;
            expect(line.isColliding(mouseCoordinates)).toBe(true);


            mouseCoordinates.x = 170;
            mouseCoordinates.y = 183;
            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 157;
            mouseCoordinates.y = 211;
            expect(line.isColliding(mouseCoordinates)).toBe(false);

            line.setIsCollidingRatio(0.04);
            mouseCoordinates.x = 157;
            mouseCoordinates.y = 211;
            expect(line.isColliding(mouseCoordinates)).toBe(true);

            mouseCoordinates.x = 156;
            mouseCoordinates.y = 211;
            expect(line.isColliding(mouseCoordinates)).toBe(false);

            // closed curve tests
            mouseCoordinates.x = 50;
            mouseCoordinates.y = 50;
            expect(closedCurve.isColliding(mouseCoordinates)).toBe(true);


            mouseCoordinates.x = 300;
            mouseCoordinates.y = 300;
            expect(closedCurve.isColliding(mouseCoordinates)).toBe(false);
        });

        it('returns undefined in `isShapeOpen` method', function () {

            var line = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [50, 100]
                ]),
                closedCurve = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [0, 0]
                ]);

            expect(line.isShapeOpen()).toBe(true);
            expect(closedCurve.isShapeOpen()).toBe(false);
        });

        it('returns undefined in `isShapeClosed` method', function () {

            var line = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [50, 100]
                ]),
                closedCurve = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [0, 0]
                ]);

            expect(line.isShapeClosed()).toBe(false);
            expect(closedCurve.isShapeClosed()).toBe(true);
        });

        it('returns true in `isShapeContinuous` method', function () {

            var line = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [50, 100]
                ]),
                closedCurve = new CanvasShapes.BezierCurve([
                    [0, 0], [50, 0], [50, 25], [0, 25], [0, 50], [100, 50],
                    [100, 75], [0, 75], [0, 100], [0, 0]
                ]);

            expect(line.isShapeContinuous()).toBe(true);
            expect(closedCurve.isShapeContinuous()).toBe(true);
        });
    });
});
