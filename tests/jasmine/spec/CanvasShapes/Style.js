/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.Shape', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8014);

                expect(
                    function () {
                        new CanvasShapes.StyleInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8002);

                expect(
                    function () {
                        new CanvasShapes.StyleAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                expect(function () {
                    new CanvasShapes.Style();
                    new CanvasShapes.Style(function () {});
                    new CanvasShapes.Style({});
                }).not.toThrow();
            });

            it('throws error when wrong arguments passed', function () {

                var temp = new CanvasShapes.Error(1048);

                expect(function () {
                    new CanvasShapes.Style(1);
                }).toThrow(temp);
                expect(function () {
                    new CanvasShapes.Style(true);
                }).toThrow(temp);
                expect(function () {
                    new CanvasShapes.Style([]);
                }).toThrow(temp);
                expect(function () {
                    new CanvasShapes.Style('string');
                }).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            it('initialises style properly', function () {

                var style = new CanvasShapes.Style();

                expect(CanvasShapes._.isFunction(style.definitions['default'])).toBe(true);
            });

            it('setting and getting definitions', function () {

                var style = new CanvasShapes.Style(),
                    some = function () {},
                    hover = function () {},
                    active = function () {},
                    obj = {};

                style.setDefinition(some, 'some');
                expect(CanvasShapes._.isFunction(style.definitions.some)).toBe(true);
                style.setHoverDefinition(hover);
                expect(CanvasShapes._.isFunction(style.definitions.hover)).toBe(true);
                style.setActiveDefinition(active);
                expect(CanvasShapes._.isFunction(style.definitions.active)).toBe(true);
                style.setDefinition(obj, 'obj');
                expect(CanvasShapes._.isObject(style.definitions.obj)).toBe(true);

                expect(style.getDefinition('some')).toBe(some);
                expect(style.getHoverDefinition()).toBe(hover);
                expect(style.getActiveDefinition()).toBe(active);
                expect(style.getDefinition('obj')).toBe(obj);
            });

            it('throws error when wrong arguments passed to setDefinition', function () {

                var temp = new CanvasShapes.Error(1048),
                    style = new CanvasShapes.Style();

                expect(function () {
                    style.setDefinition(1);
                }).toThrow(temp);
                expect(function () {
                    style.setDefinition(true);
                }).toThrow(temp);
                expect(function () {
                    style.setDefinition([]);
                }).toThrow(temp);
                expect(function () {
                    style.setDefinition('string');
                }).toThrow(temp);
            });

            it('sets and gets the same definition', function () {

                var definition = {},
                    definition2 = {
                        lineWidth: 5
                    },
                    definition3 = {
                        strokeStyle: 'black'
                    },
                    definition4 = {
                        fillStyle: 'red'
                    },
                    style = new CanvasShapes.Style(definition);

                expect(style.getDefinition()).toBe(definition);

                style.setDefinition(definition);
                expect(style.getDefinition()).toBe(definition);

                style.setHoverDefinition(definition);
                expect(style.getHoverDefinition()).toBe(definition);

                style.setActiveDefinition(definition);
                expect(style.getActiveDefinition()).toBe(definition);

                style.setDefinition(definition, 'random');
                expect(style.getDefinition('random')).toBe(definition);

                style.setDefinition(definition2, 'definition2');
                expect(style.getDefinition('definition2')).toBe(definition2);

                style.setDefinition(definition3, 'definition2');
                expect(style.getDefinition('definition2')).toBe(definition3);

                style.setDefinition(definition4, 'definition2', true);
                expect(style.getDefinition('definition2')).toEqual({
                    strokeStyle: 'black',
                    fillStyle: 'red'
                });
            });

            it('sets style as an object', function () {

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10),
                    style = new CanvasShapes.Style(),
                    contextStub = {
                        fill: function () {},
                        stroke: function () {}
                    };

                spyOn(layer, 'getContext').and.returnValue(contextStub);

                style.setDefinition({}, 'some');
                style.setHoverDefinition({});
                style.setActiveDefinition({});
                style.setDefinition({});
                style.setDefinition({
                    fillStyle: 'red'
                }, 'fillOnly');
                style.setDefinition({
                    strokeStyle: 'blue'
                }, 'strokeOnly');
                style.setDefinition({
                    strokeStyle: 'blue',
                    fillStyle: 'red'
                }, 'both');

                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');

                style.set(layer, undefined, 'some');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'hover');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'active');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'default');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'fillOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(0);

                style.set(layer, undefined, 'strokeOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(1);

                style.set(layer, undefined, 'both');
                expect(contextStub.fill.calls.count()).toBe(2);
                expect(contextStub.stroke.calls.count()).toBe(2);
            });

            it('sets style as a function', function () {

                var scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10),
                    style = new CanvasShapes.Style(),
                    contextStub = {
                        fill: function () {},
                        stroke: function () {}
                    };

                spyOn(layer, 'getContext').and.returnValue(contextStub);

                style.setDefinition(function () {}, 'some');
                style.setHoverDefinition(function () {});
                style.setActiveDefinition(function () {});
                style.setDefinition(function () {});
                style.setDefinition(function (context) {
                    context.fill();
                }, 'fillOnly');
                style.setDefinition(function (context) {
                    context.stroke();
                }, 'strokeOnly');
                style.setDefinition(function (context) {
                    context.fill();
                    context.stroke();
                }, 'both');

                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');

                style.set(layer, undefined, 'some');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'hover');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'active');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'default');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, undefined, 'fillOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(0);

                style.set(layer, undefined, 'strokeOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(1);

                style.set(layer, undefined, 'both');
                expect(contextStub.fill.calls.count()).toBe(2);
                expect(contextStub.stroke.calls.count()).toBe(2);
            });

            it('gets the line width properly', function () {

                var style1 = new CanvasShapes.Style({}),
                    style2 = new CanvasShapes.Style({
                        lineWidth: 'illegal value'
                    }),
                    style3 = new CanvasShapes.Style({
                        lineWidth: 5.2
                    });

                expect(style1.getLineWidth()).toBe(undefined);
                expect(style2.getLineWidth()).toBe(undefined);
                expect(style3.getLineWidth()).toBe(5.2);
            });

            it('gets the line width properly', function () {

                var style1 = new CanvasShapes.Style({}),
                    style2 = new CanvasShapes.Style({
                        fillStyle: 'illegal value'
                    }),
                    style3 = new CanvasShapes.Style({
                        fillStyle: 'black'
                    });

                expect(style1.isFilled()).toBe(false);
                expect(style2.isFilled()).toBe(true);
                expect(style3.isFilled()).toBe(true);
            });

            it(
                'animate throws an error when incorrect arguments passed',
            function () {

                var style = new CanvasShapes.Style(),
                    error = new CanvasShapes.Error(1050);

                expect(function () {
                    style.animate();
                }).toThrow(error);
                expect(function () {
                    style.animate('string');
                }).toThrow(error);
                expect(function () {
                    style.animate(true);
                }).toThrow(error);
                expect(function () {
                    style.animate({});
                }).toThrow(error);
                expect(function () {
                    style.animate([]);
                }).toThrow(error);
                expect(function () {
                    style.animate(10);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, 'string');
                }).toThrow(error);
                expect(function () {
                    style.animate(10, 10);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, true);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, []);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, 1);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, true);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, 'string');
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, {});
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, []);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, function () {}, 1);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, function () {}, true);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, function () {}, 'string');
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, function () {}, []);
                }).toThrow(error);
                expect(function () {
                    style.animate(10, {}, function () {}, {});
                }).toThrow(error);
            });

            it('animates when correct arguments passed', function () {

                var style = new CanvasShapes.Style();

                expect(function () {
                    style.animate(10, {});
                }).not.toThrow();
                expect(function () {
                    style.animate(10, {}, function () {});
                }).not.toThrow();
                expect(function () {
                    style.animate(10, {}, function () {}, 'default');
                }).not.toThrow();
            });
        });

        describe('can animate - async', function () {

            var contextStub, callbackSpy, shape;

            beforeEach(function (done) {

                var animate = false,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10),
                    style = new CanvasShapes.Style(),
                    callback = function () {
                        callbackSpy();
                        animate = false;
                        done();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                contextStub = {
                    fill: function () {},
                    stroke: function () {}
                };

                spyOn(layer, 'getContext').and.returnValue(contextStub);
                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');
                callbackSpy = jasmine.createSpy('callback');

                shape = new CanvasShapes.Point([0, 0], 'circle');
                style.addToShapes(shape);
                scene.addShape(shape);

                style.setDefinition({
                    fillStyle: 'red'
                });
                style.set(layer);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                style.animate(10, {
                    fillStyle: 'yellow'
                }, callback);
            });

            it('animate properly calling all the methods properly', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);
                expect(contextStub.fill).toHaveBeenCalled();
                expect(contextStub.stroke).not.toHaveBeenCalled();

                expect(shape.getStyle().getDefinition()).toEqual({
                    fillStyle: '#ffff00'
                });
            });
        });

        describe(
            'can\'t animate two animations of the same type at a time - async',
        function () {

            var contextStub, callback1Spy, callback2Spy, shape;

            beforeEach(function (done) {

                var animate = false,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10),
                    fillStyle = new CanvasShapes.Style(),
                    strokeStyle = new CanvasShapes.Style(),
                    callback1 = function () {
                        callback1Spy();
                        animate = false;
                        done();
                    },
                    callback2 = function () {
                        callback2Spy();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                contextStub = {
                    fill: function () {},
                    stroke: function () {}
                };

                spyOn(layer, 'getContext').and.returnValue(contextStub);
                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');
                callback1Spy = jasmine.createSpy('callback1');
                callback2Spy = jasmine.createSpy('callback2');

                shape = new CanvasShapes.Point([0, 0], 'circle');
                strokeStyle.addToShapes(shape);
                // this will overwrite strokeStyle
                fillStyle.addToShapes(shape);
                scene.addShape(shape);

                fillStyle.setDefinition({
                    fillStyle: 'red'
                });
                fillStyle.set(layer);

                strokeStyle.setDefinition({
                    strokeStyle: 'red'
                });
                strokeStyle.set(layer);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                strokeStyle.animate(10, {
                    strokeStyle: 'yellow'
                }, callback2);

                // this will overwrite the animation of the same type
                fillStyle.animate(100, {
                    fillStyle: 'yellow'
                }, callback1);
            });

            it('animate properly calling all the methods properly', function () {

                expect(callback1Spy).toHaveBeenCalled();
                expect(callback1Spy.calls.count()).toBe(1);
                expect(callback2Spy).not.toHaveBeenCalled();
                expect(contextStub.fill).toHaveBeenCalled();
                expect(contextStub.stroke).toHaveBeenCalled();

                expect(shape.getStyle().getDefinition()).toEqual({
                    fillStyle: '#ffff00'
                });
            });
        });

        describe(
            'can animate two animations of different type at a time - async',
        function () {

            var contextStub, callback1Spy, callback2Spy, shape;

            beforeEach(function (done) {

                var animate = false,
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 200,
                        height: 200
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 80, 80, 10, 10),
                    strokeStyle = new CanvasShapes.Style(),
                    callback1 = function () {
                        callback1Spy();
                        animate = false;
                        done();
                    },
                    callback2 = function () {
                        callback2Spy();
                    },
                    requestAnimationFrameCallback = function () {
                        if (animate) {
                            scene.render();
                            window.requestAnimationFrame(
                                requestAnimationFrameCallback
                            );
                        }
                    };

                contextStub = {
                    fill: function () {},
                    stroke: function () {}
                };

                spyOn(layer, 'getContext').and.returnValue(contextStub);
                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');
                callback1Spy = jasmine.createSpy('callback1');
                callback2Spy = jasmine.createSpy('callback2');

                shape = new CanvasShapes.Point([0, 0], 'circle');
                strokeStyle.addToShapes(shape);
                scene.addShape(shape);

                strokeStyle.setDefinition({
                    strokeStyle: 'red'
                });
                strokeStyle.set(layer);

                animate = true;
                window.requestAnimationFrame(requestAnimationFrameCallback);

                strokeStyle.animate(10, {
                    strokeStyle: 'yellow'
                }, callback2);

                // this will change the position of a point - different type
                // of animation running simultaneously which is allowed
                shape.move(100, [10, 10], callback1);
            });

            it('animate properly calling all the methods properly', function () {

                expect(callback1Spy).toHaveBeenCalled();
                expect(callback1Spy.calls.count()).toBe(1);
                expect(callback2Spy).toHaveBeenCalled();
                expect(callback2Spy.calls.count()).toBe(1);
                expect(contextStub.fill).not.toHaveBeenCalled();
                expect(contextStub.stroke).toHaveBeenCalled();

                expect(shape.getStyle().getDefinition()).toEqual({
                    strokeStyle: '#ffff00'
                });

                expect(shape.getCoordinates()).toEqual([10, 10]);
            });
        });
    });
});
