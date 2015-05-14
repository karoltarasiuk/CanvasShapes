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

                var temp = new CanvasShapes.Error(8015);

                expect(
                    function () {
                        new CanvasShapes.ShapeInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8003);

                expect(
                    function () {
                        new CanvasShapes.ShapeAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate normal class', function () {

                expect(function () {
                    new CanvasShapes.Shape();
                }).not.toThrow();
            });
        });
    });
});
