/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

        it('rendering with continue path and end point coordinates', function () {

            var beginPathSpy = jasmine.createSpy('beginPathSpy'),
                moveToSpy = jasmine.createSpy('moveToSpy'),
                lineToSpy = jasmine.createSpy('lineToSpy'),
                arcToSpy = jasmine.createSpy('arcToSpy'),
                arcSpy = jasmine.createSpy('arcSpy'),
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
                    arcTo: function () {
                        arcToSpy();
                    },
                    arc: function () {
                        arcSpy();
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
                shape1 = new CanvasShapes.Arc([[0, 0], [0, 200], [200, 200]], 20, Math.PI, Math.PI / 2);

            expect(function () {
                shape1.render(layer);
            }).not.toThrow();

            expect(beginPathSpy).toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(arcToSpy).toHaveBeenCalled();
            expect(arcSpy).not.toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();
            arcToSpy.calls.reset();
            arcSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(arcToSpy).toHaveBeenCalled();
            expect(arcSpy).not.toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();
            arcToSpy.calls.reset();
            arcSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true, [0, 0]);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
            expect(arcToSpy).toHaveBeenCalled();
            expect(arcSpy).not.toHaveBeenCalled();
        });

        it('getting coordinates', function () {

            var arc1 = new CanvasShapes.Arc([[0, 0]], 1),
                arc2 = new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 1);

            expect(arc1.getCoordinates()).toEqual([[0, 0]]);
            expect(arc2.getCoordinates()).toEqual([[0, 0], [1, 0], [1, 1]]);
        });

        it('`isShapeOpen` works correctly', function () {

            var shape1 = new CanvasShapes.Arc([[0, 0], [20, 20], [0, 40]], 20),
                shape2 = new CanvasShapes.Arc([[0, 0], [20, 20], [0, 0]], 20),
                shape3 = new CanvasShapes.Arc([[20, 20]], 20),
                shape4 = new CanvasShapes.Arc([[0, 0]], 20, 0, 1.99 * Math.PI);

            expect(shape1.isShapeOpen()).toBe(true);
            expect(shape2.isShapeOpen()).toBe(false);
            expect(shape3.isShapeOpen()).toBe(false);
            expect(shape4.isShapeOpen()).toBe(true);
        });

        it('`isShapeClosed` works correctly', function () {

            var arc1 = new CanvasShapes.Arc([[0, 0]], 10),
                arc2 = new CanvasShapes.Arc([[0, 0], [1, 0], [1, 1]], 10),
                arc3 = new CanvasShapes.Arc([[0, 0]], 10, 0, Math.PI),
                arc4 = new CanvasShapes.Arc([[0, 0]], 10, 0, 2 * Math.PI),
                arc5 = new CanvasShapes.Arc([[0, 0]], 10, 0, 1.99 * Math.PI);

            expect(arc1.isShapeClosed()).toBe(true);
            expect(arc2.isShapeClosed()).toBe(false);
            expect(arc3.isShapeClosed()).toBe(false);
            expect(arc4.isShapeClosed()).toBe(true);
            expect(arc5.isShapeClosed()).toBe(false);
        });

        it('`isShapeContinuous` works correctly', function () {

            var shape1 = new CanvasShapes.Arc([[0, 0], [20, 20], [0, 40]], 20),
                shape2 = new CanvasShapes.Arc([[20, 20]], 20),
                shape3 = new CanvasShapes.Arc([[20, 20]], 20, 0, Math.PI);

            expect(shape1.isShapeContinuous()).toBe(true);
            expect(shape2.isShapeContinuous()).toBe(true);
            expect(shape3.isShapeContinuous()).toBe(true);
        });
    });
});
