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

    describe('CanvasShapes.Rendering', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8009);

                expect(
                    function () {
                        new CanvasShapes.RenderingInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8001);

                expect(
                    function () {
                        new CanvasShapes.RenderingAbstract();
                    }
                ).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            it('setting scene interface handlers', function () {

                var i,
                    rendering = new CanvasShapes.Shape(),
                    sceneInterfaceHandlers = {
                        newLayer: function () {},
                        getLayer: function () {},
                        addShape: function () {}
                    };

                rendering.setSceneInterfaceHandlers(sceneInterfaceHandlers);
                expect(rendering.sceneInterfaceHandlers[0])
                    .toBe(sceneInterfaceHandlers);

                for (i in sceneInterfaceHandlers) {
                    expect(rendering.sceneInterfaceHandlers[i]).toBeDefined();
                    expect(_.isFunction(rendering.sceneInterfaceHandlers[i]))
                        .toBe(true);
                    expect(rendering.sceneInterfaceHandlers[0][i])
                        .toBeDefined();
                    expect(_.isFunction(rendering.sceneInterfaceHandlers[0][i]))
                        .toBe(true);
                }
            });

            it('setting and getting style', function () {

                var rendering = new CanvasShapes.Shape(),
                    style = new CanvasShapes.Style(function (context) {
                        context.fill();
                    });

                style.addToShapes(rendering);
                expect(rendering.style).toBe(style);
                expect(rendering.getStyle()).toBe(style);
            });

            it('manipulating relative rendering', function () {

                var rendering = new CanvasShapes.Shape();

                expect(rendering.getRelativeRendering()).toBe(false);
                rendering.setRelativeRendering(true);
                expect(rendering.getRelativeRendering()).toBe(true);
                rendering.setRelativeRendering(false);
                expect(rendering.getRelativeRendering()).toBe(false);
            });
        });
    });
});
