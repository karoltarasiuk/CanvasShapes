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

    describe('CanvasShapes.Shape', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8015);

                expect(
                    function () {
                        new CanvasShapes.ShapeInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8003);

                expect(
                    function () {
                        new CanvasShapes.ShapeAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                expect(function () {
                    new CanvasShapes.Shape();
                }).not.toThrow();
            });
        });

        describe('methods', function () {

            it('isColliding method', function () {

                var layer, shape1Class, shape1,
                    error2 = new CanvasShapes.Error(1037),
                    error3 = new CanvasShapes.Error(9042),
                    shape2 = new CanvasShapes.Shape([10, 10]);

                shape1Class = function () {};
                _.extend(shape1Class.prototype, CanvasShapes.InteractionAbstract.prototype);
                shape1 = new shape1Class();

                expect(function () {
                    shape1.isColliding();
                }).toThrow(error3);

                expect(function () {
                    shape2.isColliding();
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding('string');
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding(1);
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({});
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding([]);
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1 });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: 'string' });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: '1' });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: {} });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: [] });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: 2 });
                }).not.toThrow();

                expect(shape2.isColliding({ x: 1, y: 2 })).toBe(false);
                expect(shape2.isColliding({ x: 10, y: 10 })).toBe(true);
            });

            it('events manipulation', function () {

                var i = 0,
                    error1 = new CanvasShapes.Error(1042),
                    shape1 = new CanvasShapes.Shape(),
                    shape2 = new CanvasShapes.Shape(),
                    scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    handler1 = function () { i++; },
                    handler2 = function () { i--; },
                    context1 = new function () { this.prop = 0; },
                    handler3 = function () { this.prop++; };

                expect(function () { shape1.on('interaction', handler1); }).toThrow(error1);
                expect(function () { shape2.on('interaction', handler2); }).toThrow(error1);

                expect(function () { shape1.off('interaction', handler1); }).toThrow(error1);
                expect(function () { shape2.off('interaction', handler2); }).toThrow(error1);

                expect(function () { shape1.dispatch('interaction', handler1); }).toThrow(error1);
                expect(function () { shape2.dispatch('interaction', handler2); }).toThrow(error1);

                scene.addShape(shape1);
                scene.addShape(shape2);

                shape1.on('interaction', handler1);
                scene.dispatch('interaction');
                expect(i).toBe(1);

                shape1.on('interaction', handler1);
                shape2.on('interaction', handler2);
                scene.dispatch('interaction');
                expect(i).toBe(1);

                shape1.off(handler1, 'interaction');
                scene.dispatch('interaction');
                expect(i).toBe(0);

                shape2.off('interaction');
                scene.dispatch('interaction');
                expect(i).toBe(0);

                shape1.on('interaction', handler3, context1);
                scene.dispatch('interaction');
                expect(context1.prop).toBe(1);

                shape1.dispatch('interaction');
                expect(context1.prop).toBe(1);

                shape2.dispatch('interaction');
                expect(context1.prop).toBe(1);

                shape1.dispatch('interaction', context1);
                expect(context1.prop).toBe(2);

                shape2.dispatch('interaction', context1);
                expect(context1.prop).toBe(3);
            });
        });
    });
});
