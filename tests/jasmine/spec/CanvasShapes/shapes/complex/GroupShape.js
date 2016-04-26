/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {
    describe('CanvasShapes.GroupShape', function () {

        it('instantiating', function () {

            expect(function () {
                new CanvasShapes.GroupShape();
            }).not.toThrow();
        });

        it('correctly sets UUID', function () {

            var shape1 = new CanvasShapes.GroupShape(),
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(regex.test(shape1.getUUID())).toBe(true);
        });

        it('renders without throwing anything', function () {

            var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                }),
                group = new CanvasShapes.GroupShape(),
                shape1 = new CanvasShapes.Point([30, 30]),
                shape2 = new CanvasShapes.Point([60, 60]);

            group.addShapes([shape1, shape2]);
            expect(function () {
                group.render(scene.getLayer());
                group.render(scene.getLayer(), true);
                group.render(scene.getLayer(), true, [20, 20]);
            }).not.toThrow();
        });

        it('isShapeOpen works properly', function () {

            var group1 = new CanvasShapes.GroupShape(),
                group2 = new CanvasShapes.GroupShape(),
                group3 = new CanvasShapes.GroupShape(),
                line1 = new CanvasShapes.Line([[0, 0], [50, 50]]),
                line2 = new CanvasShapes.Line([[50, 50], [0, 50]]),
                line3 = new CanvasShapes.Line([[0, 50], [0, 0]]);

            group1.addShapes([line1, line2, line3]);
            group3.addShapes([line1, line2]);

            expect(group1.isShapeOpen()).toBe(false);
            expect(group2.isShapeOpen()).toBe(undefined);
            expect(group3.isShapeOpen()).toBe(true);
        });

        it('isShapeClosed works properly', function () {

            var group1 = new CanvasShapes.GroupShape(),
                group2 = new CanvasShapes.GroupShape(),
                group3 = new CanvasShapes.GroupShape(),
                line1 = new CanvasShapes.Line([[0, 0], [50, 50]]),
                line2 = new CanvasShapes.Line([[50, 50], [0, 50]]),
                line3 = new CanvasShapes.Line([[0, 50], [0, 0]]);

            group1.addShapes([line1, line2, line3]);
            group3.addShapes([line1, line2]);

            expect(group1.isShapeClosed()).toBe(true);
            expect(group2.isShapeClosed()).toBe(undefined);
            expect(group3.isShapeClosed()).toBe(false);
        });

        it('isShapeContinuous works properly', function () {

            var group1 = new CanvasShapes.GroupShape(),
                group2 = new CanvasShapes.GroupShape(),
                group3 = new CanvasShapes.GroupShape(),
                group4 = new CanvasShapes.GroupShape(),
                group5 = new CanvasShapes.GroupShape(),
                line1 = new CanvasShapes.Line([[0, 0], [50, 50]]),
                line2 = new CanvasShapes.Line([[50, 50], [0, 50]]),
                line3 = new CanvasShapes.Line([[0, 50], [0, 0]]),
                line4 = new CanvasShapes.Line([[0, 50], [0, 10]]);

            group1.addShapes([line1, line2, line3]);
            group3.addShapes([line1, line2]);
            group4.addShapes([line1, line3]);
            group5.addShapes([line1, line4]);

            expect(group1.isShapeContinuous()).toBe(true);
            expect(group2.isShapeContinuous()).toBe(undefined);
            expect(group3.isShapeContinuous()).toBe(true);
            expect(group4.isShapeContinuous()).toBe(true);
            expect(group5.isShapeContinuous()).toBe(false);
        });
    });
});
