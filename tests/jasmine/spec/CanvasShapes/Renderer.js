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

            it('events manipulation', function () {

                var i = 0,
                    renderer = new CanvasShapes.Renderer(),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
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

                renderer.addScene(new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }));
                renderer.addScene(new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }));

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
    });
});
