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

    describe('CanvasShapes.Interaction', function () {

        describe('instantiating', function () {

            it('cannot instantiate an interface', function () {

                var temp = new CanvasShapes.Error(8010);

                expect(
                    function () {
                        new CanvasShapes.InteractionInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8018);

                expect(
                    function () {
                        new CanvasShapes.InteractionAbstract();
                    }
                ).toThrow(temp);
            });
        });

        describe('abstract methods', function () {

            // it('can ignore events properly', function () {

            //     var temp = 0,
            //         shape = new CanvasShapes.Shape(),
            //         scene = new CanvasShapes.Scene({ element: document.createElement('div'), width: 100, height: 100 });

            //     scene.addShape(shape);

            //     shape.sceneInterfaceHandlers.on('interaction1', function () { temp++; });
            //     shape.sceneInterfaceHandlers.on('interaction2', function () { --temp; });

            //     expect(function () { shape.ignoreEvents('custom', 'interaction1'); }).not.toThrow();
            //     scene.dispatch('interaction1');
            //     expect(temp).toBe(0);
            //     scene.dispatch('interaction2');
            //     expect(temp).toBe(-1);
            //     expect(function () { shape.stopIgnoringEvents('custom', 'interaction1'); }).not.toThrow();

            //     scene.dispatch('interaction1');
            //     scene.dispatch('interaction1');
            //     expect(temp).toBe(1);
            //     scene.dispatch('interaction2');
            //     expect(temp).toBe(0);

            //     expect(function () { shape.ignoreEvents(); }).not.toThrow();
            //     scene.dispatch('interaction1');
            //     expect(temp).toBe(0);
            //     scene.dispatch('interaction2');
            //     expect(temp).toBe(0);
            //     expect(function () { shape.stopIgnoringEvents(); }).not.toThrow();

            //     scene.dispatch('interaction1');
            //     scene.dispatch('interaction1');
            //     expect(temp).toBe(2);
            //     scene.dispatch('interaction2');
            //     expect(temp).toBe(1);
            // });
        });
    });
});
