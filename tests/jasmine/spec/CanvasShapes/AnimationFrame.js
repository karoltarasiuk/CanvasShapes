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

    describe('CanvasShapes.AnimationFrame', function () {

        it('initializes properly', function () {

            expect(function () { new CanvasShapes.AnimationFrame(
                new CanvasShapes.Shape(),
                10,
                function () {}
            ); }).not.toThrow();

            expect(function () { new CanvasShapes.AnimationFrame(
                new CanvasShapes.Shape(),
                10,
                function () {},
                function () {}
            ); }).not.toThrow();

            expect(function () { new CanvasShapes.AnimationFrame(
                new CanvasShapes.Shape(),
                10,
                function () {},
                function () {},
                {}
            ); }).not.toThrow();
        });

        it('can\'t initialize', function () {

            var error1 = new CanvasShapes.Error(8023),
                error2 = new CanvasShapes.Error(8024);

            expect(function () { new CanvasShapes.AnimationFrameInterface(); })
                .toThrow(error1);
            expect(function () { new CanvasShapes.AnimationFrameAbstract(); })
                .toThrow(error2);
        });

        it('throws error when arguments are invalid', function () {

            var error1 = new CanvasShapes.Error(1043);

            // validating `shape`
            expect(function () {
                new CanvasShapes.AnimationFrame('not object');
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(1);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(true);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame([]);
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame({});
            }).toThrow(error1);

            // validating `totalAnimationTime`
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    true
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    'not number'
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    {}
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    []
                );
            }).toThrow(error1);

            // validating `stepCallback`
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    1
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    true
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    []
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    {}
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    1,
                    'not function'
                );
            }).toThrow(error1);

            // validating `callback`
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    1
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    true
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    []
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    {}
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    'not function'
                );
            }).toThrow(error1);

            // validating `variables`
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    function () {},
                    1
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    function () {},
                    true
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    function () {},
                    []
                );
            }).toThrow(error1);
            expect(function () {
                new CanvasShapes.AnimationFrame(
                    new CanvasShapes.Shape(),
                    10,
                    function () {},
                    function () {},
                    'not object'
                );
            }).toThrow(error1);
        });

        it('calls next and reset methods properly', function () {

            var pastTime, currentTime,
                scene = new CanvasShapes.Scene({
                    element: document.createElement('div'),
                    width: 100,
                    height: 100
                }),
                shape = new CanvasShapes.Shape(),
                frame = new CanvasShapes.AnimationFrame(
                    shape,
                    10,
                    function () {},
                    function () {},
                    {}
                );

            scene.addShape(shape);
            spyOn(shape.sceneInterfaceHandlers, 'requestRendering');
            spyOn(frame, 'stepCallback');

            pastTime = (new Date()).getTime();
            frame.next();
            currentTime = (new Date()).getTime();
            expect(frame.startTime).not.toBeUndefined();
            expect(currentTime >= frame.startTime).toBe(true);
            expect(frame.startTime >= pastTime).toBe(true);
            expect(shape.sceneInterfaceHandlers.requestRendering).toHaveBeenCalled();
            expect(frame.stepCallback).toHaveBeenCalled();

            frame.reset();
            expect(frame.callbackCalled).toBeUndefined();
            expect(frame.startTime).toBeUndefined();
        });
    });
});