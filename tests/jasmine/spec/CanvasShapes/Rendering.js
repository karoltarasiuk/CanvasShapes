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

            it('can instantiate normal class', function () {

                expect(
                    function () {
                        new CanvasShapes.Rendering();
                    }
                ).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('setting scene interface handlers', function () {

                var rendering = new CanvasShapes.Rendering(),
                    sceneInterfaceHandlers = {
                        newLayerHandler: function () {},
                        getLayerHandler: function () {},
                        addShapeHandler: function () {}
                    };

                rendering.setSceneInterfaceHandlers(sceneInterfaceHandlers);
                expect(rendering.sceneInterfaceHandlers).toBe(sceneInterfaceHandlers);
            });

            it('setting and getting style', function () {

                var rendering = new CanvasShapes.Rendering(),
                    style = new CanvasShapes.Style({
                        fill: true
                    });

                rendering.setStyle(style);
                expect(rendering.style).toBe(style);
                expect(rendering.getStyle()).toBe(style);
            });

            it('getting number of separate layers', function () {

                var rendering = new CanvasShapes.Rendering();
                expect(rendering.numberOfSeparateLayersNeeded()).toBe(0);
            });
        });
    });
});
