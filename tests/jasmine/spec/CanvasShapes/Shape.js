/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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

            it('cannot pass wrong format of coordinates or instantiate abstract Shape class', function () {

                var error = new CanvasShapes.Error(8025);

                expect(function () {
                    new CanvasShapes.Shape(true);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape('string');
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape([]);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape({});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape(function () {});
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape([0]);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape([[0], [0]]);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape([0, 0]);
                }).toThrow(error);
                expect(function () {
                    new CanvasShapes.Shape([[0, 0], [10, 10]]);
                }).toThrow(error);
            });

            it('can instantiate normal class', function () {

                expect(function () {
                    new CanvasShapes.Point([0, 0], 'circle');
                }).not.toThrow();
            });

            it('correctly sets min and max coordinates variables', function () {

                var shape1 = new CanvasShapes.Point([0, 0]);

                expect(shape1.MAX_COORDINATES).toBe(1);
                expect(shape1.MIN_COORDINATES).toBe(1);
            });

            it('correctly sets UUID', function () {

                var shape1 = new CanvasShapes.Point([0, 0]),
                    regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                expect(regex.test(shape1.getUUID())).toBe(true);
            });
        });

        describe('abstract methods', function () {

            it('sets and gets parent correctly', function () {

                var shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle'),
                    group = new CanvasShapes.Group(),
                    error = new CanvasShapes.Error(1046);

                expect(function () {
                    shape1.setParent(shape2);
                }).toThrow(error);

                expect(function () {
                    shape1.setParent(group);
                    group.addShapes([shape2]);
                }).not.toThrow();

                expect(shape1.getParent()).toBe(group);
                expect(shape2.getParent()).toBe(group);
            });

            it('gets rendering parent correctly', function () {

                var shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0], 'circle'),
                    group = new CanvasShapes.Group();

                expect(shape1.getRenderingShape()).toBe(shape1);
                expect(shape2.getRenderingShape()).toBe(shape2);

                shape1.setParent(group);
                group.addShapes([shape2]);

                expect(shape1.getRenderingShape()).toBe(group);
                expect(shape2.getRenderingShape()).toBe(group);
            });
        });

        describe('methods', function () {

            it('setIsCollidingRatio method', function () {

                var error = new CanvasShapes.Error(1057),
                    shape = new CanvasShapes.Point([10, 10]);

                expect(function () {
                    shape.setIsCollidingRatio(true);
                }).toThrow(error);

                expect(function () {
                    shape.setIsCollidingRatio({});
                }).toThrow(error);

                expect(function () {
                    shape.setIsCollidingRatio([]);
                }).toThrow(error);

                expect(function () {
                    shape.setIsCollidingRatio('string');
                }).toThrow(error);

                expect(function () {
                    shape.setIsCollidingRatio(function () {});
                }).toThrow(error);

                expect(function () {
                    shape.setIsCollidingRatio(100);
                }).not.toThrow();
            });

            it('calculateAllowedError method', function () {

                var scene, layer,
                    shape = new CanvasShapes.Point([10, 10]),
                    shape2 = new CanvasShapes.Line([[10, 10], [20, 20]]),
                    style = new CanvasShapes.Style({
                        lineWidth: 5
                    });

                scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 50,
                    height: 50
                });
                layer = scene.newLayer(shape);
                scene.addShape(shape2, layer);
                style.addToShapes(shape2);

                expect(shape.calculateAllowedError(layer)).toBe(0.5);

                shape.setIsCollidingRatio(0);
                expect(shape.calculateAllowedError(layer)).toBe(0);

                shape.setIsCollidingRatio(0.02);
                expect(shape.calculateAllowedError(layer)).toBe(1);

                shape.setIsCollidingRatio(0.015);
                expect(shape.calculateAllowedError(layer)).toBe(0.75);

                shape.setIsCollidingRatio(0.04);
                expect(shape.calculateAllowedError(layer)).toBe(2);

                shape2.setIsCollidingRatio(0);
                expect(shape2.calculateAllowedError(layer)).toBe(2.5);

                shape2.setIsCollidingRatio(0.04);
                expect(shape2.calculateAllowedError(layer)).toBe(4.5);
            });

            it('isColliding method', function () {

                var scene, layer, shape1Class, shape1,
                    error2 = new CanvasShapes.Error(1037),
                    error3 = new CanvasShapes.Error(9042),
                    shape2 = new CanvasShapes.Point([10, 10]);

                scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                });
                layer = scene.newLayer(shape2);

                shape1Class = function () {};
                CanvasShapes._.extend(
                    shape1Class.prototype,
                    CanvasShapes.InteractionAbstract.prototype
                );
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
                    shape2.isColliding({ x: 1, y: [], scene: {} });
                }).toThrow(error2);

                expect(function () {
                    shape2.isColliding({ x: 1, y: 2, scene: scene });
                }).not.toThrow();

                expect(shape2.isColliding({ x: 1, y: 2, scene: scene })).toBe(false);
                expect(shape2.isColliding({ x: 11.0001, y: 11.0001, scene: scene })).toBe(false);
                expect(shape2.isColliding({ x: 8.999, y: 8.999, scene: scene })).toBe(false);

                expect(shape2.isColliding({ x: 10, y: 10, scene: scene })).toBe(true);
                expect(shape2.isColliding({ x: 9, y: 9, scene: scene })).toBe(true);
                expect(shape2.isColliding({ x: 11, y: 11, scene: scene })).toBe(true);

                shape2.setIsCollidingRatio(0.05);

                expect(shape2.isColliding({ x: 1, y: 2, scene: scene })).toBe(false);
                expect(shape2.isColliding({ x: 15.0001, y: 15.0001, scene: scene })).toBe(false);
                expect(shape2.isColliding({ x: 4.999, y: 4.999, scene: scene })).toBe(false);

                expect(shape2.isColliding({ x: 10, y: 10, scene: scene })).toBe(true);
                expect(shape2.isColliding({ x: 5, y: 5, scene: scene })).toBe(true);
                expect(shape2.isColliding({ x: 15, y: 15, scene: scene })).toBe(true);
            });

            it('events manipulation', function () {

                var i = 0,
                    error1 = new CanvasShapes.Error(1042),
                    shape1 = new CanvasShapes.Point([0, 0], 'circle'),
                    shape2 = new CanvasShapes.Point([0, 0]),
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    handler1 = function () { i++; },
                    handler2 = function () { i--; },
                    context1 = new function () { this.prop = 0; },
                    handler3 = function () { this.prop++; };

                expect(function () { shape1.on('interaction', handler1); })
                    .toThrow(error1);
                expect(function () { shape2.on('interaction', handler2); })
                    .toThrow(error1);

                expect(function () { shape1.off('interaction', handler1); })
                    .toThrow(error1);
                expect(function () { shape2.off('interaction', handler2); })
                    .toThrow(error1);

                expect(function () {
                    shape1.dispatch('interaction', handler1);
                }).toThrow(error1);
                expect(function () {
                    shape2.dispatch('interaction', handler2);
                }).toThrow(error1);

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

        describe('move animation - async - when time is less than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(0, [100, 100], callback);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([100, 100]);
            });
        });

        describe('move animation - async - when time is more than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(15, [100, 100], callback);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([100, 100]);
            });
        });

        describe('move animation with function - async - when time is less than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(0, function (coords, totalTime, curTime) {
                    var ratio;
                    if (curTime >= totalTime) {
                        coords[0] = 100;
                        coords[1] = 50;
                    } else {
                        ratio = (curTime / totalTime) * 100;
                        coords[0] = ratio;
                        ratio = ratio/100 * (2 * Math.PI);
                        coords[1] = Math.sin(ratio) * 50 + 50;
                    }
                    return coords;
                }, callback);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([100, 50]);
            });
        });

        describe('move animation with function - async - when time is more than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(15, function (coords, totalTime, curTime) {
                    var ratio;
                    if (curTime >= totalTime) {
                        coords[0] = 100;
                        coords[1] = 50;
                    } else {
                        ratio = (curTime / totalTime) * 100;
                        coords[0] = ratio;
                        ratio = ratio/100 * (2 * Math.PI);
                        coords[1] = Math.sin(ratio) * 50 + 50;
                    }
                    return coords;
                }, callback);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([100, 50]);
            });
        });

        describe('move animation with offset object - async - when time is less than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(0, { x: 10, y: 5, z: -5 }, callback, shape1);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([10, 5, -5]);
            });
        });

        describe('move animation with offset object - async - when time is more than MIN_ANIMATION_TIME', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(15, { x: 10, y: 5, z: -5 }, callback, shape1);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([10, 5, -5]);
            });
        });

        describe('move animation with offset object 2 - async', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Point([0, 0, 0]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(0, { z: -5 }, callback, shape1);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([0, 0, -5]);
            });
        });

        describe('move animation with offset object 3 - async', function () {

            var shape1, callbackSpy, i;

            beforeEach(function (done) {

                var animate = false,
                    scene1 = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 100,
                        height: 100
                    }),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene1.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                i = 0;
                callbackSpy = jasmine.createSpy('callback');
                shape1 = new CanvasShapes.Polygon([[10, 10], [50, 50], [100, 10]]);
                scene1.addShape(shape1);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                shape1.move(0, { x: 5, y: -5 }, callback, shape1);
            });

            it('moves the shape properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);

                expect(shape1.getCoordinates()).toEqual([[15, 5], [55, 45], [105, 5]]);
            });
        });
    });
});
