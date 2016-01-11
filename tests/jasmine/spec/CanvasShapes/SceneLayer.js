/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

            it('can\'t instantiate normal class', function () {

                var error = new CanvasShapes.Error(1055),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                // scene is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer({});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer([]);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer('string');
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(1);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(function () {});
                }).toThrow(error);

                // width is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, []);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 'string');
                }).toThrow(error);

                // height is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, []);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 'string');
                }).toThrow(error);

                // left is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, []);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 'string');
                }).toThrow(error);

                // top is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, []);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 'string');
                }).toThrow(error);

                // offScreen is wrong
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 0, {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 0, []);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 0, function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 0, 1);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.SceneLayer(scene, 0, 0, 0, 0, 'string');
                }).toThrow(error);
            });

            it('can instantiate normal class', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('can fetch the scene', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                }).not.toThrow();

                expect(layer1.getScene()).toBe(scene);
                expect(layer2.getScene()).toBe(scene);
                expect(layer3.getScene()).toBe(scene);
                expect(layer4.getScene()).toBe(scene);
            });

            it('can get the width', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                }).not.toThrow();

                expect(layer1.getWidth()).toBe(200);
                expect(layer2.getWidth()).toBe(100);
                expect(layer3.getWidth()).toBe(80);
                expect(layer4.getWidth()).toBe(80);
            });

            it('can get the height', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                }).not.toThrow();

                expect(layer1.getHeight()).toBe(200);
                expect(layer2.getHeight()).toBe(100);
                expect(layer3.getHeight()).toBe(80);
                expect(layer4.getHeight()).toBe(80);
            });

            it('can get the context', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                    layer1.getContext();
                    layer2.getContext();
                    layer3.getContext();
                    layer4.getContext();
                }).not.toThrow();

                expect(layer1.getContext()).toBeDefined();
                expect(layer2.getContext()).toBeDefined();
                expect(layer3.getContext()).toBeDefined();
                expect(layer4.getContext()).toBeDefined();

                expect(layer1.getContext() instanceof CanvasRenderingContext2D)
                    .toBe(true);
                expect(layer2.getContext() instanceof CanvasRenderingContext2D)
                    .toBe(true);
                expect(layer3.getContext() instanceof CanvasRenderingContext2D)
                    .toBe(true);
                expect(layer4.getContext() instanceof CanvasRenderingContext2D)
                    .toBe(true);
            });

            it('can get the canvas', function () {

                var layer1, layer2, layer3, layer4,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    });

                expect(function () {
                    layer1 = new CanvasShapes.SceneLayer(scene);
                    layer2 = new CanvasShapes.SceneLayer(scene, 100, 100);
                    layer3 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10);
                    layer4 = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10, true);
                    layer1.getCanvas();
                    layer2.getCanvas();
                    layer3.getCanvas();
                    layer4.getCanvas();
                }).not.toThrow();

                expect(layer1.getCanvas()).toBeDefined();
                expect(layer2.getCanvas()).toBeDefined();
                expect(layer3.getCanvas()).toBeDefined();
                expect(layer4.getCanvas()).toBeDefined();

                expect(layer1.getCanvas() instanceof HTMLCanvasElement)
                    .toBe(true);
                expect(layer2.getCanvas() instanceof HTMLCanvasElement)
                    .toBe(true);
                expect(layer3.getCanvas() instanceof HTMLCanvasElement)
                    .toBe(true);
                expect(layer4.getCanvas() instanceof HTMLCanvasElement)
                    .toBe(true);
            });

            it('can clear', function () {
                // very tricky to test, skipping now
            });
        });
    });
});
