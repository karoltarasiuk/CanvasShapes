/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    wrongScene = new CanvasShapes.Group();

                expect(function () {
                    renderer.addScene(scene);
                    renderer.addScene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });
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
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    });

                expect(function () {
                    renderer.render();
                }).not.toThrow();

                renderer.addScene(scene);
                renderer.addScene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                });

                expect(function () {
                    renderer.render();
                }).not.toThrow();
            });

            it('adding shapes', function () {

                var i, j, count,
                    renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle');

                renderer.addScene(scene);
                renderer.addScene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                });

                expect(function () {
                    renderer.addShapes([shape1, shape2]);
                }).not.toThrow();

                expect(function () {
                    renderer.addShapes([shape1, shape2], 'new');
                }).not.toThrow();

                for (i = 0; i < renderer._scenes.length; i++) {
                    count = 0;
                    for (j in renderer._scenes[i]._layers) {
                        count++;
                    }
                    expect(count).toBe(2);
                }

                expect(function () {
                    renderer.addShapes([shape2], 'new');
                }).not.toThrow();

                for (i = 0; i < renderer._scenes.length; i++) {
                    count = 0;
                    for (j in renderer._scenes[i]._layers) {
                        count++;
                    }
                    expect(count).toBe(3);
                }
            });

            it('events manipulation', function () {

                var i = 0,
                    renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    handler1 = function () { i++; },
                    handler2 = function () { i--; },
                    context1 = new function () { this.prop = 0; },
                    handler3 = function () { this.prop++; };

                renderer.addScene(scene);

                renderer.on('event', handler1);
                renderer.on('event', handler2);
                renderer.dispatch('event');
                expect(i).toBe(0);

                renderer.off(handler1);
                renderer.dispatch('event');
                expect(i).toBe(-1);

                // this handler will be added but previous get deleted
                renderer.on('event', handler2);
                renderer.dispatch('event');
                expect(i).toBe(-2);

                // there won't be any events
                renderer.off('event');
                renderer.dispatch('event');
                expect(i).toBe(-2);

                renderer.on('event', handler1);
                renderer.on('event', handler2);
                renderer.off(handler2, 'custom');
                renderer.dispatch('event');
                expect(i).toBe(-2);

                renderer.on('yo', handler3, context1);
                renderer.dispatch('yo');
                expect(context1.prop).toBe(1);

                renderer.addScene(new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                }));
                renderer.addScene(new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                }));

                i = 0;
                context1.prop = 0;

                renderer.on('event', handler1);
                renderer.on('event', handler2);
                renderer.dispatch('event');
                expect(i).toBe(0);

                renderer.off(handler1);
                renderer.dispatch('event');
                expect(i).toBe(-3);

                // this handler will be added but previous get deleted
                renderer.on('event', handler2);
                renderer.dispatch('event');
                expect(i).toBe(-6);

                // there won't be any events
                renderer.off('event');
                renderer.dispatch('event');
                expect(i).toBe(-6);

                renderer.on('event', handler1);
                renderer.on('event', handler2);
                renderer.off(handler2, 'custom');
                renderer.dispatch('event');
                expect(i).toBe(-6);

                // there are 3 scenes added to renderer so it will be executed
                // 3 times as well
                renderer.on('some_event', handler3, context1);
                renderer.dispatch('some_event');
                expect(context1.prop).toBe(3);

                // there are 3 scenes added to renderer so it will be executed
                // 3 times as well
                renderer.dispatch('some_event', context1);
                expect(context1.prop).toBe(6);
            });
        });

        describe('static methods - async', function () {

            var renderer1, renderer2, renderer3, fps1, fps2;

            beforeEach(function (done) {

                renderer1 = new CanvasShapes.Renderer();
                renderer2 = new CanvasShapes.Renderer();

                spyOn(renderer1, 'render');
                spyOn(renderer2, 'render');

                CanvasShapes.Renderer.start();

                setTimeout(function () {

                    fps1 = CanvasShapes.Renderer.getFPS();
                    CanvasShapes.Renderer.stop();
                    fps2 = CanvasShapes.Renderer.getFPS();

                    renderer3 = new CanvasShapes.Renderer();
                    spyOn(renderer3, 'render');

                    done();
                }, 100);
            });

            it('start & stop methods', function () {

                expect(renderer1.render).toHaveBeenCalled();
                expect(renderer2.render).toHaveBeenCalled();
                expect(renderer3.render).not.toHaveBeenCalled();
            });

            it('getting FPS', function () {

                expect(fps1).not.toBe(0);
                expect(fps2).toBe(0);
            });
        });
    });
});
