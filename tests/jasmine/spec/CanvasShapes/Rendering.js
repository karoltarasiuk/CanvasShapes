/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
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
                    rendering = new CanvasShapes.Point([0, 0], 'circle'),
                    sceneInterfaceHandlers = {
                        newLayer: function () {},
                        getLayer: function () {},
                        addShape: function () {}
                    };

                rendering.setSceneInterfaceHandlers(sceneInterfaceHandlers);
                expect(rendering._sceneInterfaceHandlers[0])
                    .toBe(sceneInterfaceHandlers);

                for (i in sceneInterfaceHandlers) {
                    expect(rendering._sceneInterfaceHandlers[i]).toBeDefined();
                    expect(CanvasShapes._.isFunction(rendering._sceneInterfaceHandlers[i]))
                        .toBe(true);
                    expect(rendering._sceneInterfaceHandlers[0][i])
                        .toBeDefined();
                    expect(CanvasShapes._.isFunction(rendering._sceneInterfaceHandlers[0][i]))
                        .toBe(true);
                }
            });

            it('setting and getting style', function () {

                var rendering = new CanvasShapes.Point([0, 0], 'circle'),
                    style = new CanvasShapes.Style(function (context) {
                        context.fill();
                    });

                style.addToShapes(rendering);
                // expect(rendering._style).toBe(style);
                expect(rendering.getStyle()).toBe(style);
            });

            it('manipulating relative rendering', function () {

                var rendering = new CanvasShapes.Point([0, 0], 'circle');

                expect(rendering.getRelativeRendering()).toBe(false);
                rendering.setRelativeRendering(true);
                expect(rendering.getRelativeRendering()).toBe(true);
                rendering.setRelativeRendering(false);
                expect(rendering.getRelativeRendering()).toBe(false);
            });

            it('calculating allowed error', function () {

                var rendering = new CanvasShapes.Point([0, 0], 'circle'),
                    Layer = function (w, h) {
                        this.w = w;
                        this.h = h;
                        this.getWidth = function () { return w; };
                        this.getHeight = function () { return h; };
                    },
                    style = new CanvasShapes.Style({
                        lineWidth: 10
                    }),
                    layer1 = new Layer(100, 50),
                    layer2 = new Layer(100, 200),
                    layer3 = new Layer(500, 300);

                expect(rendering.calculateAllowedError(layer1)).toBe(1);
                expect(rendering.calculateAllowedError(layer2)).toBe(2);
                expect(rendering.calculateAllowedError(layer3)).toBe(5);
                style.addToShapes([rendering]);
                expect(rendering.calculateAllowedError(layer1)).toBe(6);
                rendering.setRelativeRendering(true);
                expect(rendering.calculateAllowedError(layer2)).toBe(12);
            });

            it('checking whether shape is filled', function () {

                var rendering = new CanvasShapes.Point([0, 0], 'circle'),
                    style1 = new CanvasShapes.Style(),
                    style2 = new CanvasShapes.Style({}),
                    style3 = new CanvasShapes.Style({
                        fillStyle: 'black'
                    });

                style1.addToShapes(rendering);
                expect(rendering.isFilled()).toBe(false);
                style2.addToShapes(rendering);
                expect(rendering.isFilled()).toBe(false);
                style3.addToShapes(rendering);
                expect(rendering.isFilled()).toBe(true);
            });

            it('getting line width', function () {

                var rendering = new CanvasShapes.Point([0, 0], 'circle'),
                    style1 = new CanvasShapes.Style(),
                    style2 = new CanvasShapes.Style({}),
                    style3 = new CanvasShapes.Style({
                        lineWidth: 5
                    });

                style1.addToShapes(rendering);
                expect(rendering.getLineWidth()).toBeUndefined();
                style2.addToShapes(rendering);
                expect(rendering.getLineWidth()).toBeUndefined();
                style3.addToShapes(rendering);
                expect(rendering.getLineWidth()).toBe(5);
            });
        });
    });
});
