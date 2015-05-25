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

    describe('CanvasShapes.Error', function () {

        var error = new CanvasShapes.Error();

        it('getting message by code', function () {

            expect(error.getMessageByCode(13)).toBe('');
            expect(error.getMessageByCode(1013)).toBe("CanvasShapes.Rectangle or CanvasShapes.Square - passed coordinates are not creating 90 degrees angle");
            expect(error.getMessageByCode(8013)).toBe("CanvasShapes.ClassInterface - can't instantiate interface");
            expect(error.getMessageByCode(9013)).toBe('CanvasShapes.CoordinatesInterface - `validateCoordinates()` is not implemented');
        });

        it('converting to string', function () {

            var temp = new CanvasShapes.Error(1013);

            expect(error.toString()).toBe('CanvasShapes.Error');
            expect(temp.toString()).toBe('CanvasShapes.Error: 1013 - CanvasShapes.Rectangle or CanvasShapes.Square - passed coordinates are not creating 90 degrees angle');
        });

        it('throwing an error', function () {

            expect(function () {
                throw new CanvasShapes.Error();
            }).toThrow(error);

            expect(function () {
                throw new CanvasShapes.Error(1013);
            }).toThrow(new CanvasShapes.Error(1013));
        });
    });
});
