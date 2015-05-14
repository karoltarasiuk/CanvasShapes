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

    describe('CanvasShapes.SceneLayer', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8016);

                expect(
                    function () {
                        new CanvasShapes.SceneLayerInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8017);

                expect(
                    function () {
                        new CanvasShapes.SceneLayerAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                var layer1, layer2, layer3,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('can fetch the scene', function () {

                var layer1, layer2, layer3,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                }).not.toThrow();

                expect(layer1.getScene()).toBe(scene);
                expect(layer2.getScene()).toBe(scene);
                expect(layer3.getScene()).toBe(scene);
            });

            it('can get the width', function () {

                var layer1, layer2, layer3,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                }).not.toThrow();

                expect(layer1.getWidth()).toBe(200);
                expect(layer2.getWidth()).toBe(100);
                expect(layer3.getWidth()).toBe(80);
            });

            it('can get the height', function () {

                var layer1, layer2, layer3,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                }).not.toThrow();

                expect(layer1.getHeight()).toBe(200);
                expect(layer2.getHeight()).toBe(100);
                expect(layer3.getHeight()).toBe(80);
            });

            it('can get the context', function () {

                var layer1, layer2, layer3,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 200, height: 200 });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer1.getContext();
                    layer2.getContext();
                    layer3.getContext();
                }).not.toThrow();

                expect(layer1.getContext()).toBeDefined();
                expect(layer2.getContext()).toBeDefined();
                expect(layer3.getContext()).toBeDefined();

                expect(layer1.getContext() instanceof CanvasRenderingContext2D).toBe(true);
                expect(layer2.getContext() instanceof CanvasRenderingContext2D).toBe(true);
                expect(layer3.getContext() instanceof CanvasRenderingContext2D).toBe(true);
            });
        });
    });
});
