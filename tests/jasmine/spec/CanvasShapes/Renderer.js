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

    describe('CanvasShapes.Renderer', function () {

        describe('instantiating', function () {

            it('can instantiate normal class', function () {

                expect(
                    function () {
                        new CanvasShapes.Renderer();
                    }
                ).not.toThrow();
            });
        });

        describe('class methods', function () {

            it('adding scene', function () {

                var renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    wrongScene = new CanvasShapes.Group();

                expect(function () {
                    renderer.addScene(scene);
                    renderer.addScene({ element: document.createElement('div'), width: 100, height: 100 });
                }).not.toThrow();

                expect(function () {
                    renderer.addScene(wrongScene);
                }).toThrow(new CanvasShapes.Error(1023));

                expect(function () {
                    renderer.addScene({});
                }).toThrow(new CanvasShapes.Error(1001));
            });

            it('rendering', function () {

                var renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    renderer.render();
                }).not.toThrow();

                renderer.addScene(scene);
                renderer.addScene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    renderer.render();
                }).not.toThrow();
            });

            it('adding shapes', function () {

                var renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape();

                renderer.addScene(scene);
                renderer.addScene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    renderer.addShapes([shape1, shape2]);
                }).not.toThrow();
            });
        });
    });
});
