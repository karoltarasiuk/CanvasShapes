/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

                expect( function () { new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                }); } ).not.toThrow();

                expect( function () { new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    height: 100
                }); } ).toThrow(error1);

                expect( function () { new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100
                }); } ).toThrow(error1);

                expect( function () { new CanvasShapes.Scene({
                    element: document.createElement('div') }
                ); } ).toThrow(error1);

                expect( function () {
                    new CanvasShapes.Scene({});
                } ).toThrow(error1);

                expect( function () { new CanvasShapes.Scene({
                    id: 'non-existing-element-id',
                    width: 100,
                    height: 100
                }); } ).toThrow(error2);
            });
        });

        describe('abstract methods', function () {

            it('adding new layer', function () {

                var layer,
                    error1 = new CanvasShapes.Error(1019),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

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

            it('shouldRenderOffScreen method', function () {

                var scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    scene2 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100,
                        RENDER_OFF_SCREEN: true
                    }),
                    scene3 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100,
                        RENDER_OFF_SCREEN: false
                    });

                expect(scene1.shouldRenderOffScreen()).toBe(false);
                expect(scene2.shouldRenderOffScreen()).toBe(true);
                expect(scene3.shouldRenderOffScreen()).toBe(false);
            });

            it('positions layers properly', function () {

                var layer1, layer2, layer3, i, canvas1, canvas2, canvas3,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    scene2 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100,
                        RENDER_OFF_SCREEN: true
                    }),
                    scene3 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100,
                        RENDER_OFF_SCREEN: false
                    });

                layer1 = scene1.newLayer();
                layer2 = scene2.newLayer(
                    undefined,
                    undefined,
                    undefined,
                    20,
                    10
                );
                layer3 = scene3.newLayer();

                canvas1 = layer1.getCanvas();
                canvas2 = layer2.getCanvas();
                canvas3 = layer3.getCanvas();

                expect(canvas1.style.marginLeft).toBe('');
                expect(canvas1.style.marginTop).toBe('');
                expect(canvas1.style.position).toBe('absolute');
                expect(canvas1.style.top).toBe('');
                expect(canvas1.style.left).toBe('');

                expect(canvas2.style.marginLeft).toBe(-layer2.getWidth() + 'px');
                expect(canvas2.style.marginTop).toBe(-layer2.getHeight() + 'px');
                expect(canvas2.style.position).toBe('fixed');
                expect(canvas2.style.top).toBe('0px');
                expect(canvas2.style.left).toBe('0px');

                expect(canvas3.style.marginLeft).toBe('');
                expect(canvas3.style.marginTop).toBe('');
                expect(canvas3.style.position).toBe('absolute');
                expect(canvas3.style.top).toBe('');
                expect(canvas3.style.left).toBe('');
            });

            it('initialising layers', function () {

                var i, UUID,
                    count = 0,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

                expect(function () {
                    layer = scene.initialiseLayers();
                }).not.toThrow();

                expect(scene._layers).not.toBe(undefined);
                expect(scene._layers).not.toEqual({});

                for (i in scene._layers) {
                    count++;
                    UUID = i;
                }

                expect(count).toBe(1);
                expect(scene._layers[UUID].layer).not.toBe(undefined);
                expect(scene._layers[UUID].layer.is('CanvasShapes.SceneLayer'))
                    .toBe(true);
                expect(scene._layers[UUID].shapes).toEqual({});
            });

            it('returning whether should render off screen', function () {

                var scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    scene2 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100,
                        RENDER_OFF_SCREEN: true
                    });

                expect(scene1.shouldRenderOffScreen()).toBe(false);
                expect(scene2.shouldRenderOffScreen()).toBe(true);
            });

            it('adding shapes', function () {

                var i, UUID, UUID2, layer1,
                    count = 0,
                    count2 = 0,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape3 = new CanvasShapes.Point([0, 0], 'circle');

                expect(function () {
                    layer1 = scene.addShape(shape1);
                }).not.toThrow();

                for (i in scene._layers) {
                    UUID = i;
                    count++;
                }

                expect(scene._layers[UUID].shapes).not.toEqual({});

                for (i in scene._layers[UUID].shapes) {
                    UUID2 = i;
                    count2++;
                }

                expect(count2).toBe(1);
                expect(scene._layers[UUID].shapes[UUID2]).toBe(shape1);

                expect(function () {
                    scene.addShape(shape2, layer2);
                }).not.toThrow();

                count = 0;
                for (i in scene._layers) {
                    UUID = i;
                    count++;
                }
                count2 = 0;
                for (i in scene._layers[UUID].shapes) {
                    UUID2 = i;
                    count2++;
                }

                expect(count).toBe(2);
                expect(scene._layers[UUID].layer).not.toBe(undefined);
                expect(scene._layers[UUID].layer.is('CanvasShapes.SceneLayer'))
                    .toBe(true);
                expect(scene._layers[UUID].shapes).not.toEqual({});
                expect(count2).toBe(1);
                expect(scene._layers[UUID].shapes[UUID2]).toBe(shape2);

                expect(function () {
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                count = 0;
                for (i in scene._layers) {
                    count++;
                }
                for (i in scene._layers) {
                    UUID = i;
                    break;
                }
                count2 = 0;
                for (i in scene._layers[UUID].shapes) {
                    UUID2 = i;
                    count2++;
                }

                expect(count).toBe(2);
                expect(count2).toBe(2);
                expect(scene._layers[UUID].shapes[UUID2]).toBe(shape3);
            });

            it('getting layer', function () {

                var layer1,
                    error = new CanvasShapes.Error(1021),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape3 = new CanvasShapes.Point([0, 0], 'circle');

                expect(function () {
                    layer1 = scene.addShape(shape1);
                    scene.addShape(shape2, layer2);
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                expect(scene.getLayer()).toBe(layer2);
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
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    layer2 = new CanvasShapes.SceneLayer(scene),
                    shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape3 = new CanvasShapes.Point([0, 0], 'circle');

                expect(function () {
                    layer1 = scene.addShape(shape1);
                    scene.addShape(shape2, layer2);
                    scene.addShape(shape3, layer1);
                }).not.toThrow();

                layerObject1 = {
                    layer: layer1,
                    shapes: {}
                };
                layerObject1.shapes[shape1.getUUID()] = shape1;
                layerObject1.shapes[shape3.getUUID()] = shape3;

                layerObject2 = {
                    layer: layer2,
                    shapes: {}
                };
                layerObject2.shapes[shape2.getUUID()] = shape2;

                expect(scene.getLayerObject()).toEqual(layerObject2);
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

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    sceneInterfaceHandlers = scene.getSceneInterfaceHandlers();

                expect(sceneInterfaceHandlers).toBeDefined();
                expect(CanvasShapes._.isObject(sceneInterfaceHandlers)).toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.newLayer))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.getLayer))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.addShape))
                    .toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.on)).toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.off)).toBe(true);
                expect(CanvasShapes._.isFunction(sceneInterfaceHandlers.dispatch))
                    .toBe(true);
            });

            it('getting width, height and dom element', function () {

                var dom1 = document.createElement('div'),
                    dom2 = document.createElement('div'),
                    scene1 = new CanvasShapes.Scene({
                        element: dom1,
                        width: 100,
                        height: 100
                    }),
                    scene2 = new CanvasShapes.Scene({
                        element: dom2,
                        width: 300,
                        height: 800
                    });

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

            it('initialising listeners', function () {

                var scene1, dom1 = document.createElement('div');

                // initialiseListeners() is being called on initialisation
                expect(function () {
                    scene1 = new CanvasShapes.Scene({
                        element: dom1,
                        width: 100,
                        height: 100
                    });
                }).not.toThrow();
                expect(scene1._handlers).toEqual({});
            });

            it('events manipulation', function () {

                var i = 0,
                    dom1 = document.createElement('div'),
                    scene1 = new CanvasShapes.Scene({
                        element: dom1,
                        width: 100,
                        height: 100
                    }),
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

            it('request rendering method', function () {

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    shape = new CanvasShapes.Point([0, 0]),
                    callbackSpy = jasmine.createSpy('callback'),
                    callback = function () {
                        callbackSpy();
                    },
                    beforeRenderSpy = jasmine.createSpy('beforeRender'),
                    beforeRender = function () {
                        beforeRenderSpy();
                    },
                    animationFrameSpy = jasmine.createSpy('animationFrame'),
                    animationFrame = {
                        next: function () {
                            animationFrameSpy();
                        },
                        getType: function () {
                            return '';
                        }
                    };

                scene.addShape(shape);
                scene.requestRendering(shape, callback, beforeRender);
                scene.render();

                expect(callbackSpy).toHaveBeenCalled();
                expect(beforeRenderSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);
                expect(beforeRenderSpy.calls.count()).toBe(1);

                scene.requestRendering(shape, animationFrame, beforeRender);
                scene.render();

                expect(animationFrameSpy).toHaveBeenCalled();
                expect(beforeRenderSpy).toHaveBeenCalled();
                expect(animationFrameSpy.calls.count()).toBe(1);
                expect(beforeRenderSpy.calls.count()).toBe(2);
            });
        });

        describe('class methods', function () {

            it('validating config', function () {

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    config1 = {},
                    config2 = { width: 100, height: 100 },
                    config3 = { id: {}, width: 100, height: 100 },
                    config4 = {
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    },
                    config5 = {
                        id: 'existing-element-id',
                        width: 100,
                        height: 100
                    },
                    config6 = {
                        element: document.createElement('div'),
                        height: 100
                    },
                    config7 = { id: 'existing-element-id', height: 100 },
                    config8 = {
                        element: document.createElement('div'),
                        width: 100
                    },
                    config9 = { id: 'existing-element-id', width: 100 };

                expect(scene._validateConfig(config1)).toBe(false);
                expect(scene._validateConfig(config2)).toBe(false);
                expect(scene._validateConfig(config3)).toBe(false);
                expect(scene._validateConfig(config4)).toBe(true);
                expect(scene._validateConfig(config5)).toBe(true);
                expect(scene._validateConfig(config6)).toBe(false);
                expect(scene._validateConfig(config7)).toBe(false);
                expect(scene._validateConfig(config8)).toBe(false);
                expect(scene._validateConfig(config9)).toBe(false);
            });

            it('rendering', function () {

                var scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                });

                expect(function () {
                    scene.render();
                }).not.toThrow();
            });
        });
    });
});
