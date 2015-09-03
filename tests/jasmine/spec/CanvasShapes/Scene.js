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

    describe('CanvasShapes.Scene', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8008);

                expect(
                    function () {
                        new CanvasShapes.SceneInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8007);

                expect(
                    function () {
                        new CanvasShapes.SceneAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                var error1 = new CanvasShapes.Error(1001),
                    error2 = new CanvasShapes.Error(1005);

                expect(
                    function () {
                        new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });
                    }
                ).not.toThrow();

                expect(
                    function () {
                        new CanvasShapes.Scene({ element: document.createElement('div'), height: 100 });
                    }
                ).toThrow(error1);

                expect(
                    function () {
                        new CanvasShapes.Scene({ element: document.createElement('div'), width: 100 });
                    }
                ).toThrow(error1);

                expect(
                    function () {
                        new CanvasShapes.Scene({ element: document.createElement('div') });
                    }
                ).toThrow(error1);

                expect(
                    function () {
                        new CanvasShapes.Scene({});
                    }
                ).toThrow(error1);

                expect(
                    function () {
                        new CanvasShapes.Scene({ id: 'non-existing-element-id', width: 100, height: 100 });
                    }
                ).toThrow(error2);
            });
        });

        describe('abstract methods', function () {

            it('adding new layer', function () {

                var layer,
                    error1 = new CanvasShapes.Error(1019);
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    layer = scene.newLayer();
                }).not.toThrow();
                expect(layer.is('CanvasShapes.SceneLayer')).toBe(true);

                expect(function () {
                    layer = scene.newLayer({});
                }).toThrow();

                expect(function () {
                    layer = scene.newLayer(new CanvasShapes.Class());
                }).toThrow(error1);
            });

            it('initializing layers', function () {

                var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    layer = scene.initializeLayers();
                }).not.toThrow();

                expect(scene.layers).not.toBe(undefined);
                expect(scene.layers).not.toEqual([]);
                expect(scene.layers.length).toBe(1);
                expect(scene.layers[0].layer).not.toBe(undefined);
                expect(scene.layers[0].layer.is('CanvasShapes.SceneLayer')).toBe(true);
                expect(scene.layers[0].shapes).toEqual([]);
            });

            it('adding shapes', function () {

                var layer1,
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape(),
                    shape3 = new CanvasShapes.Shape();

                expect(function () {
                    layer1 = scene.addShape(shape1);
                }).not.toThrow();

                expect(scene.layers[0].shapes).not.toEqual([]);
                expect(scene.layers[0].shapes.length).toBe(1);
                expect(scene.layers[0].shapes[0]).toBe(shape1);

                expect(function () {
                    scene.addShape(shape2, layer2);
                }).not.toThrow();

                expect(scene.layers.length).toBe(2);
                expect(scene.layers[1].layer).not.toBe(undefined);
                expect(scene.layers[1].layer.is('CanvasShapes.SceneLayer')).toBe(true);
                expect(scene.layers[1].shapes).not.toEqual([]);
                expect(scene.layers[1].shapes.length).toBe(1);
                expect(scene.layers[1].shapes[0]).toBe(shape2);

                expect(function () {
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                expect(scene.layers.length).toBe(2);
                expect(scene.layers[0].shapes.length).toBe(2);
                expect(scene.layers[0].shapes[1]).toBe(shape3);
            });

            it('getting layer', function () {

                var layer1,
                    error = new CanvasShapes.Error(1021),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape(),
                    shape3 = new CanvasShapes.Shape();

                expect(function () {
                    layer1 = scene.addShape(shape1);
                    scene.addShape(shape2, layer2);
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                expect(scene.getLayer()).toBe(layer1);
                expect(scene.getLayer(layer1)).toBe(layer1);
                expect(scene.getLayer(layer2)).toBe(layer2);
                expect(scene.getLayer(shape1)).toBe(layer1);
                expect(scene.getLayer(shape2)).toBe(layer2);
                expect(scene.getLayer(shape3)).toBe(layer1);

                expect(function () {
                    scene.getLayer({});
                }).toThrow(error);

                expect(function () {
                    scene.getLayer(0);
                }).toThrow(error);

                expect(function () {
                    scene.getLayer('string');
                }).toThrow(error);

                expect(function () {
                    scene.getLayer(true);
                }).toThrow(error);

                expect(function () {
                    scene.getLayer([]);
                }).toThrow(error);
            });

            it('getting layer object', function () {

                var layer1, layerObject1, layerObject2,
                    error = new CanvasShapes.Error(1021),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape(),
                    shape3 = new CanvasShapes.Shape();

                expect(function () {
                    layer1 = scene.addShape(shape1);
                    scene.addShape(shape2, layer2);
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                layerObject1 = {
                    layer: layer1,
                    shapes: [shape1, shape3]
                };

                layerObject2 = {
                    layer: layer2,
                    shapes: [shape2]
                };

                expect(scene.getLayerObject()).toEqual(layerObject1);
                expect(scene.getLayerObject(layer1)).toEqual(layerObject1);
                expect(scene.getLayerObject(layer2)).toEqual(layerObject2);
                expect(scene.getLayerObject(shape1)).toEqual(layerObject1);
                expect(scene.getLayerObject(shape2)).toEqual(layerObject2);
                expect(scene.getLayerObject(shape3)).toEqual(layerObject1);

                expect(function () {
                    scene.getLayerObject({});
                }).toThrow(error);

                expect(function () {
                    scene.getLayerObject(0);
                }).toThrow(error);

                expect(function () {
                    scene.getLayerObject('string');
                }).toThrow(error);

                expect(function () {
                    scene.getLayerObject(true);
                }).toThrow(error);

                expect(function () {
                    scene.getLayerObject([]);
                }).toThrow(error);
            });

            it('getting scene interface handlers', function () {

                var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    sceneInterfaceHandlers = scene.getSceneInterfaceHandlers();

                expect(sceneInterfaceHandlers).toBeDefined();
                expect(_.isObject(sceneInterfaceHandlers)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.newLayerHandler)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.getLayerHandler)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.addShapeHandler)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.on)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.off)).toBe(true);
                expect(_.isFunction(sceneInterfaceHandlers.dispatch)).toBe(true);
            });

            it('getting width, height and dom element', function () {

                var dom1 = document.createElement('div'),
                    dom2 = document.createElement('div'),
                    scene1 = new CanvasShapes.Scene({ element: dom1, width: 100, height: 100 }),
                    scene2 = new CanvasShapes.Scene({ element: dom2, width: 300, height: 800 });

                // width
                expect(scene1.getWidth()).toBe(100);
                expect(scene2.getWidth()).toBe(300);

                // height
                expect(scene1.getHeight()).toBe(100);
                expect(scene2.getHeight()).toBe(800);

                // dom
                expect(scene1.getDom()).toBe(dom1);
                expect(scene2.getDom()).toBe(dom2);
            });

            it('initializing listeners', function () {

                var scene1, dom1 = document.createElement('div');

                // initializeListeners() is being called on initialisation
                expect(function () {
                    scene1 = new CanvasShapes.Scene({ element: dom1, width: 100, height: 100 });
                }).not.toThrow();
                expect(scene1.handlers).toEqual({});
            });

            it('events manipulation', function () {

                var i = 0,
                    dom1 = document.createElement('div'),
                    scene1 = new CanvasShapes.Scene({ element: dom1, width: 100, height: 100 }),
                    handler1 = function () { i++; },
                    handler2 = function () { i--; },
                    context1 = new function () { this.prop = 0; },
                    handler3 = function () { this.prop++; };

                scene1.on('event', handler1);
                scene1.on('event', handler2);
                scene1.dispatch('event');
                expect(i).toBe(0);

                scene1.off(handler1);
                scene1.dispatch('event');
                expect(i).toBe(-1);

                // this handler will be added but previous get deleted
                scene1.on('event', handler2);
                scene1.dispatch('event');
                expect(i).toBe(-2);

                // there won't be any events
                scene1.off('event');
                scene1.dispatch('event');
                expect(i).toBe(-2);

                scene1.on('event', handler1);
                scene1.on('event', handler2);
                scene1.off(handler2, 'custom');
                scene1.dispatch('event');
                expect(i).toBe(-2);

                scene1.on('some_event', handler3, context1);
                scene1.dispatch('some_event');
                expect(context1.prop).toBe(1);

                scene1.dispatch('some_event', context1);
                expect(context1.prop).toBe(2);

                scene1.dispatch('some_event', scene1);
                expect(context1.prop).toBe(2);
            });
        });

        describe('class methods', function () {

            it('validating config', function () {

                var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    config1 = {},
                    config2 = { width: 100, height: 100 },
                    config3 = { id: {}, width: 100, height: 100 },
                    config4 = { element: document.createElement('div'), width: 100, height: 100 },
                    config5 = { id: 'existing-element-id', width: 100, height: 100 },
                    config6 = { element: document.createElement('div'), height: 100 },
                    config7 = { id: 'existing-element-id', height: 100 },
                    config8 = { element: document.createElement('div'), width: 100 },
                    config9 = { id: 'existing-element-id', width: 100 };

                expect(scene.validateConfig(config1)).toBe(false);
                expect(scene.validateConfig(config2)).toBe(false);
                expect(scene.validateConfig(config3)).toBe(false);
                expect(scene.validateConfig(config4)).toBe(true);
                expect(scene.validateConfig(config5)).toBe(true);
                expect(scene.validateConfig(config6)).toBe(false);
                expect(scene.validateConfig(config7)).toBe(false);
                expect(scene.validateConfig(config8)).toBe(false);
                expect(scene.validateConfig(config9)).toBe(false);
            });

            it('rendering', function () {

                var scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });

                expect(function () {
                    scene.render();
                }).not.toThrow();
            });
        });
    });
});
