/*global define, describe, it, expect*/
define([
    "lodash",
    "CanvasShapes"
], function(
    _,
    CanvasShapes
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

            //
        });
    });
});
