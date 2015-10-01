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
                    new CanvasShapes.Style({});
                }).toThrow(temp);
                expect(function () {
                    new CanvasShapes.Style('string');
                }).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            it('initializes style properly', function () {

                var style = new CanvasShapes.Style();

                expect(_.isFunction(style.definitions['default'])).toBe(true);
            });

            it('setting definitions', function () {

                var style = new CanvasShapes.Style();

                style.setDefinition(function () {}, 'some');
                expect(_.isFunction(style.definitions.some)).toBe(true);
                style.setHoverDefinition(function () {});
                expect(_.isFunction(style.definitions.hover)).toBe(true);
                style.setActiveDefinition(function () {});
                expect(_.isFunction(style.definitions.active)).toBe(true);
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
                    style.setDefinition({});
                }).toThrow(temp);
                expect(function () {
                    style.setDefinition('string');
                }).toThrow(temp);
            });

            it('setting style', function () {

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

                style.set(layer, 'some');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, 'hover');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, 'active');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, 'default');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, 'fillOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(0);

                style.set(layer, 'strokeOnly');
                expect(contextStub.fill.calls.count()).toBe(1);
                expect(contextStub.stroke.calls.count()).toBe(1);

                style.set(layer, 'both');
                expect(contextStub.fill.calls.count()).toBe(2);
                expect(contextStub.stroke.calls.count()).toBe(2);
            });
        });
    });
});
