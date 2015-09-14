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
                    new CanvasShapes.Style({});
                }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('initializes style properly', function () {

                var style = new CanvasShapes.Style();

                expect(style.definitions['default']).toEqual({});
                style.initialize(1);
                expect(style.definitions['default']).toEqual({});
                style.initialize(true);
                expect(style.definitions['default']).toEqual({});
                style.initialize('string');
                expect(style.definitions['default']).toEqual({});
                style.initialize({});
                expect(style.definitions['default']).toEqual({});
                style.initialize([]);
                expect(style.definitions['default']).toEqual({});
            });

            it('setting definitions', function () {

                var style = new CanvasShapes.Style();

                style.setDefinition(1, 'some');
                expect(style.definitions.some).toEqual({});
                style.setDefinition(true, 'other');
                expect(style.definitions.other).toEqual({});
                style.setHoverDefinition('string');
                expect(style.definitions.hover).toEqual({});
                style.setActiveDefinition({});
                expect(style.definitions.active).toEqual({});
                style.setDefinition([]);
                expect(style.definitions['default']).toEqual({});
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

                style.setDefinition(1, 'some');
                style.setDefinition(true, 'other');
                style.setHoverDefinition('string');
                style.setActiveDefinition({});
                style.setDefinition([]);
                style.setDefinition({
                    fill: true
                }, 'fillOnly');
                style.setDefinition({
                    stroke: true
                }, 'strokeOnly');
                style.setDefinition({
                    fill: true,
                    stroke: true
                }, 'both');

                spyOn(contextStub, 'fill');
                spyOn(contextStub, 'stroke');

                style.set(layer, 'some');
                expect(contextStub.fill.calls.any()).toBe(false);
                expect(contextStub.stroke.calls.any()).toBe(false);

                style.set(layer, 'other');
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
