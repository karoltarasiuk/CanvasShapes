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

        it('can animate properly', function () {});
    });
});
