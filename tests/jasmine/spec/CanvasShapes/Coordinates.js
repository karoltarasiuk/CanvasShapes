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

                var temp = new CanvasShapes.Error(8012);

                expect(
                    function () {
                        new CanvasShapes.CoordinatesInterface();
                    }
                ).toThrow(temp);
            });

            it('cannot instantiate an abstract', function () {

                var temp = new CanvasShapes.Error(8004);

                expect(
                    function () {
                        new CanvasShapes.CoordinatesAbstract();
                    }
                ).toThrow(temp);
            });

            it('can instantiate a shape', function () {

                expect(function () {
                    new CanvasShapes.Shape();
                    new CanvasShapes.Shape([0, 0]);
                    new CanvasShapes.Shape([[0, 0], [10, 10]]);
                }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('process coordinates', function () {

                var coordinates1 = [10, 10],
                    coordinates2 = [[10, 10], [20, 20]],
                    coordinates3 = [new CanvasShapes.Shape([10, 10]), new CanvasShapes.Point([20, 20])],
                    layer = new CanvasShapes.SceneLayer(scene, 50, 50),
                    shape = new CanvasShapes.Shape();

                expect(shape.processCoordinates(coordinates1)).toEqual(coordinates1);
                expect(shape.processCoordinates(coordinates2, true)).toEqual(coordinates2);
                expect(shape.processCoordinates(coordinates3, true)).toEqual(coordinates2);

                shape.setRelativeRendering(true);

                expect(shape.processCoordinates(coordinates1, false, layer)).toEqual([5, 5]);
                expect(shape.processCoordinates(coordinates2, true, layer)).toEqual([[5, 5], [10, 10]]);
                expect(shape.processCoordinates(coordinates3, true, layer)).toEqual([[5, 5], [10, 10]]);
            });

            it('validateCoordinates', function () {

                var i,
                    coordinates1 = [10, 10],
                    wrongCoordinates = [
                        [10],
                        {},
                        'a',
                        10,
                        true
                    ],
                    shape = new CanvasShapes.Shape(),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinates(coordinates1)).toBe(true);
                expect(function () { shape.validateCoordinates(coordinates1, true); }).not.toThrow();

                expect(shape.validateCoordinates(shape)).toBe(true);
                expect(function () { shape.validateCoordinates(shape, true); }).not.toThrow();

                for (i = 0; i < wrongCoordinates.length; i++) {
                    expect(shape.validateCoordinates(wrongCoordinates[i])).toBe(false);
                    expect(function () { shape.validateCoordinates(wrongCoordinates[i], true); }).toThrow(error);
                }
            });

            it('validateCoordinatesArray', function () {

                var i,
                    coordinates1 = [[10, 10], [20, 20]],
                    coordinates2 = [new CanvasShapes.Shape([10, 10]), new CanvasShapes.Point([20, 20])],
                    wrongCoordinates = [
                        [10],
                        {},
                        'a',
                        10,
                        true
                    ],
                    shape = new CanvasShapes.Shape(),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinatesArray(coordinates1)).toBe(true);
                expect(function () { shape.validateCoordinatesArray(coordinates1, true); }).not.toThrow();

                expect(shape.validateCoordinatesArray(coordinates2)).toBe(true);
                expect(function () { shape.validateCoordinatesArray(coordinates2, true); }).not.toThrow();

                expect(shape.validateCoordinatesArray(coordinates1, false, 2, 2)).toBe(true);
                expect(function () { shape.validateCoordinatesArray(coordinates1, true, 2, 2); }).not.toThrow();

                expect(shape.validateCoordinatesArray(coordinates2, false, 2, 2)).toBe(true);
                expect(function () { shape.validateCoordinatesArray(coordinates2, true, 2, 2); }).not.toThrow();

                expect(shape.validateCoordinatesArray(coordinates1, false, 1, 1)).toBe(false);
                expect(function () { shape.validateCoordinatesArray(coordinates1, true, 1, 1); }).toThrow(error);

                expect(shape.validateCoordinatesArray(coordinates2, false, 1, 1)).toBe(false);
                expect(function () { shape.validateCoordinatesArray(coordinates2, true, 1, 1); }).toThrow(error);

                expect(shape.validateCoordinatesArray(coordinates1, false, 3, 3)).toBe(false);
                expect(function () { shape.validateCoordinatesArray(coordinates1, true, 3, 3); }).toThrow(error);

                expect(shape.validateCoordinatesArray(coordinates2, false, 3, 3)).toBe(false);
                expect(function () { shape.validateCoordinatesArray(coordinates2, true, 3, 3); }).toThrow(error);

                for (i = 0; i < wrongCoordinates.length; i++) {
                    expect(shape.validateCoordinatesArray(wrongCoordinates[i])).toBe(false);
                    expect(function () { shape.validateCoordinatesArray(wrongCoordinates[i], true); }).toThrow(error);
                }
            });

            it('get and set coordinates', function () {

                var coordinates1 = [0, 0],
                    coordinates2 = [[0, 0], [10, 10]],
                    shape  = new CanvasShapes.Shape();

                expect(shape.getCoordinates()).toBeUndefined();
                shape.setCoordinates(coordinates1);
                expect(shape.getCoordinates()).toBe(coordinates1);
                shape.setCoordinates(coordinates2);
                expect(shape.getCoordinates()).toBe(coordinates2);
            });
        });
    });
});
