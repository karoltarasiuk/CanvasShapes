/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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
            expect(circle.MAX_COORDINATES).toBe(3);
        });

        it('rendering', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 200,
                    height: 200
                }),
                layer = new CanvasShapes.SceneLayer(scene),
                circle = new CanvasShapes.Circle([0, 0], 1);

            expect(function () {
                circle.render(layer);
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
                shape1 = new CanvasShapes.Arc([[100, 100]], 20, Math.PI, Math.PI / 2);

            expect(function () {
                shape1.render(layer);
            }).not.toThrow();

            expect(beginPathSpy).toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).not.toHaveBeenCalled();
            expect(arcToSpy).not.toHaveBeenCalled();
            expect(arcSpy).toHaveBeenCalled();

            beginPathSpy.calls.reset();
            moveToSpy.calls.reset();
            lineToSpy.calls.reset();
            arcToSpy.calls.reset();
            arcSpy.calls.reset();

            expect(function () {
                shape1.render(layer, true);
            }).not.toThrow();

            expect(beginPathSpy).not.toHaveBeenCalled();
            expect(moveToSpy).not.toHaveBeenCalled();
            expect(lineToSpy).not.toHaveBeenCalled();
            expect(arcToSpy).not.toHaveBeenCalled();
            expect(arcSpy).toHaveBeenCalled();

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
            expect(lineToSpy).not.toHaveBeenCalled();
            expect(arcToSpy).not.toHaveBeenCalled();
            expect(arcSpy).toHaveBeenCalled();
        });

        it('getting coordinates', function () {

            var circle1 = new CanvasShapes.Circle([0, 0], 1),
                circle2 = new CanvasShapes.Circle([40, 120], 1);

            expect(circle1.getCoordinates()).toEqual([[0, 0]]);
            expect(circle2.getCoordinates()).toEqual([[40, 120]]);
        });

        it('`isShapeOpen` works correctly', function () {

            var circle1 = new CanvasShapes.Circle([0, 0], 20),
                // this is illegal, circle constructor doesn't accept angles
                circle2 = new CanvasShapes.Circle([0, 0], 20, 0, Math.PI);

            expect(circle1.isShapeOpen()).toBe(false);
            expect(circle2.isShapeOpen()).toBe(false);
        });

        it('`isShapeClosed` works correctly', function () {

            var circle1 = new CanvasShapes.Circle([0, 0], 20),
                // this is illegal, circle constructor doesn't accept angles
                circle2 = new CanvasShapes.Circle([0, 0], 20, 0, Math.PI);

            expect(circle1.isShapeClosed()).toBe(true);
            expect(circle2.isShapeClosed()).toBe(true);
        });

        it('`isShapeContinuous` works correctly', function () {

            var circle1 = new CanvasShapes.Circle([0, 0], 20),
                circle2 = new CanvasShapes.Circle([0, 0], 20, 0, Math.PI);

            expect(circle1.isShapeContinuous()).toBe(true);
            expect(circle2.isShapeContinuous()).toBe(true);
        });
    });
});
