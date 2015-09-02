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

    describe('CanvasShapes.Animation', function () {

        it('initializes properly', function () {

            expect(function () { new CanvasShapes.Shape(); }).not.toThrow();
        });

        it('can\'t initialize', function () {

            var error1 = new CanvasShapes.Error(8021),
                error2 = new CanvasShapes.Error(8022);

            expect(function () { new CanvasShapes.AnimationInterface(); }).toThrow(error1);
            expect(function () { new CanvasShapes.AnimationAbstract(); }).toThrow(error2);
        });

        it('callbacks have not been called before animation', function () {

            var scene1 = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                point1 = new CanvasShapes.Point([0, 0]),
                i = 0,
                stepSpy = jasmine.createSpy('step'),
                callbackSpy = jasmine.createSpy('callback'),
                obj1 = {
                    callback: function () {},
                    step: function () {}
                };

            expect(stepSpy).not.toHaveBeenCalled();
            expect(callbackSpy).not.toHaveBeenCalled();

            point1.animate(0, obj1.step, obj1.callback, point1);
        });

        it('throws error when arguments are invalid', function () {

            var scene1 = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                point1 = new CanvasShapes.Point([0, 0]),
                error1 = new CanvasShapes.Error(1043);

            expect(function () { point1.animate(); }).toThrow(error1);
            expect(function () { point1.animate('a'); }).toThrow(error1);
            expect(function () { point1.animate(0, 'a'); }).toThrow(error1);
            expect(function () { point1.animate(0, function () {}); }).not.toThrow();

            expect(function () { point1.animate(0, function () {}, 'a'); }).toThrow(error1);
            expect(function () { point1.animate(0, function () {}, function () {}); }).not.toThrow();

            expect(function () { point1.animate(0, function () {}, function () {}, 'a'); }).toThrow(error1);
            expect(function () { point1.animate(0, function () {}, function () {}, {}); }).not.toThrow();
        });

        describe('getting animation frame - async', function () {

            var callbackSpy, i;

            beforeEach(function (done) {

                var scene1 = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    point1 = new CanvasShapes.Point([0, 0]),
                    callback = function (time) {
                        i = time;
                        callbackSpy();
                        done();
                    };

                i = undefined;
                callbackSpy = jasmine.createSpy('callback');

                point1.getAnimationFrame(callback);
            });

            it('callback has been called', function () {

                expect(callbackSpy).toHaveBeenCalled();
                expect(i).toBeDefined();
                expect(_.isNumber(i)).toBe(true);
            });
        });

        describe('after animation check - async', function () {

            var stepSpy, callbackSpy, i;

            beforeEach(function (done) {

                var scene1 = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 }),
                    point1 = new CanvasShapes.Point([0, 0]),
                    callback = function () {
                        callbackSpy();
                        done();
                    },
                    step = function () {
                        stepSpy();
                        i++;
                    };

                i = 0;
                stepSpy = jasmine.createSpy('step');
                callbackSpy = jasmine.createSpy('callback');

                // step and callback will only be called once
                point1.animate(0, step, callback, point1);
            });

            it('callbacks have been called', function () {

                expect(stepSpy).toHaveBeenCalled();
                expect(stepSpy.calls.count()).toBe(1);
                expect(i).toBe(1);

                expect(callbackSpy).toHaveBeenCalled();
                expect(callbackSpy.calls.count()).toBe(1);
            });
        });
    });
});
