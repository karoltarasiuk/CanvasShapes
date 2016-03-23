/*global define, describe, it, expect*/
define([
    "CanvasShapes"
], function(
    CanvasShapes
) {

    describe('CanvasShapes.Coordinates', function () {

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
                    new CanvasShapes.Point([0, 0], 'circle');
                }).not.toThrow();
            });
        });

        describe('abstract methods', function () {

            it('process coordinates', function () {

                var coordinates1 = [10, 10],
                    coordinates2 = [[10, 10], [20, 20]],
                    coordinates3 = [
                        new CanvasShapes.Point([10, 10]),
                        new CanvasShapes.Point([20, 20])
                    ],
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 50,
                        height: 50
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 50, 50),
                    shape = new CanvasShapes.Point([0, 0], 'circle');

                expect(shape.processCoordinates(coordinates1))
                    .toEqual(coordinates1);
                expect(shape.processCoordinates(coordinates2))
                    .toEqual(coordinates2);
                expect(shape.processCoordinates(coordinates3))
                    .toEqual([[10, 10, 0], [20, 20, 0]]);

                shape.setRelativeRendering(true);

                expect(shape.processCoordinates(coordinates1, layer))
                    .toEqual([5, 5]);
                expect(shape.processCoordinates(coordinates2, layer))
                    .toEqual([[5, 5], [10, 10]]);
                expect(shape.processCoordinates(coordinates3, layer))
                    .toEqual([[5, 5, 0], [10, 10, 0]]);
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
                    shape = new CanvasShapes.Point([0, 0], 'circle'),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinates(coordinates1)).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true);
                }).not.toThrow();

                expect(shape.validateCoordinates(shape)).toBe(true);
                expect(function () { shape.validateCoordinates(shape, true); })
                    .not.toThrow();

                for (i = 0; i < wrongCoordinates.length; i++) {
                    expect(shape.validateCoordinates(wrongCoordinates[i]))
                        .toBe(false);
                    expect(function () {
                        shape.validateCoordinates(wrongCoordinates[i], true);
                    }).toThrow(error);
                }
            });

            it('translateOffsetToCoordinates', function () {

                var shape = new CanvasShapes.Point([0, 0], 'circle'),
                    error = new CanvasShapes.Error(1047),
                    arr = [
                        [{ x: 3, y: 2, z: 1 }, [3, 2, 1]],
                        [{ x: 3, z: 1 }, [3, 0, 1]],
                        [{ x: 3, y: 2 }, [3, 2, 0]],
                        [{ y: 2, z: 1 }, [0, 2, 1]],
                        [{ x: 1 }, [1, 0, 0]],
                        [{ y: 1 }, [0, 1, 0]],
                        [{ z: 1 }, [0, 0, 1]],
                        [{}, [0, 0, 0]],
                    ];

                expect(function () {
                    shape.translateOffsetToCoordinates();
                }).toThrow(error);

                expect(function () {
                    shape.translateOffsetToCoordinates(true);
                }).toThrow(error);

                expect(function () {
                    shape.translateOffsetToCoordinates(1);
                }).toThrow(error);

                expect(function () {
                    shape.translateOffsetToCoordinates('string');
                }).toThrow(error);

                expect(function () {
                    shape.translateOffsetToCoordinates([]);
                }).toThrow(error);

                for (i = 0; i < arr.length; i++) {
                    expect(
                        shape.translateOffsetToCoordinates(arr[i][0])
                    ).toEqual(arr[i][1]);
                }
            });

            it('translates coordinates by offset and multiplier', function () {

                var shape = new CanvasShapes.Point([0, 0], 'circle'),
                    arr = [
                        [[[2, 3, 4]], {}, undefined, [[2, 3, 4]]],
                        [[[2, 3, 4]], {}, 1, [[2, 3, 4]]],
                        [[[2, 3, 4]], {}, 2, [[4, 6, 8]]],
                        [[[2, 3, 4]], { x: 1 }, undefined, [[3, 3, 4]]],
                        [[[2, 3, 4]], { x: -1 }, 1, [[1, 3, 4]]],
                        [[[2, 3, 4]], { x: -1 }, 2, [[3, 6, 8]]],
                        [[[2, 3, 4]], { y: 1 }, undefined, [[2, 4, 4]]],
                        [[[2, 3, 4]], { y: -1 }, 1, [[2, 2, 4]]],
                        [[[2, 3, 4]], { y: -1 }, 2, [[4, 5, 8]]],
                        [[[2, 3, 4]], { z: 1 }, undefined, [[2, 3, 5]]],
                        [[[2, 3, 4]], { z: -1 }, 1, [[2, 3, 3]]],
                        [[[2, 3, 4]], { z: -1 }, 2, [[4, 6, 7]]],
                        [
                            [[2, 3, 4]],
                            { x: 1, y: 1, z: 1 },
                            undefined,
                            [[3, 4, 5]]
                        ],
                        [[[2, 3, 4]], { x: -1, y: -1, z: -1 }, 1, [[1, 2, 3]]],
                        [[[2, 3, 4]], { x: -1, y: -1, z: -1 }, 2, [[3, 5, 7]]]
                    ],
                    error = new CanvasShapes.Error(1049),
                    error2 = new CanvasShapes.Error(1047),
                    error3 = new CanvasShapes.Error(1011);

                expect(function () {
                    shape.translateCoordinates();
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates([]);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates([[]]);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates(true);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates(1);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates('string');
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates({});
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates([true]);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates([1, 2, 3]);
                }).toThrow(error3);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], []);
                }).toThrow(error2);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], true);
                }).toThrow(error2);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], 1);
                }).toThrow(error2);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], 'string');
                }).toThrow(error2);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {}, {});
                }).toThrow(error);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {}, []);
                }).toThrow(error);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {}, true);
                }).toThrow(error);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {}, 'string');
                }).toThrow(error);

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {});
                }).not.toThrow();

                expect(function () {
                    shape.translateCoordinates([[1, 1, 1]], {}, 1);
                }).not.toThrow();

                for (i = 0; i < arr.length; i++) {
                    expect(
                        shape.translateCoordinates(
                            arr[i][0],
                            arr[i][1],
                            arr[i][2]
                        )
                    ).toEqual(arr[i][3]);
                }
            });

            it('validateCoordinatesArray', function () {

                var i,
                    coordinates1 = [[10, 10], [20, 20]],
                    coordinates2 = [
                        new CanvasShapes.Point([10, 10]),
                        new CanvasShapes.Point([20, 20])
                    ],
                    wrongCoordinates = [
                        [10],
                        {},
                        'a',
                        10,
                        true,
                        []
                    ],
                    shape = new CanvasShapes.Point([0, 0], 'circle'),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinatesArray(coordinates1)).toBe(true);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates1, true);
                }).not.toThrow();

                expect(shape.validateCoordinatesArray(coordinates2)).toBe(true);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates2, true);
                }).not.toThrow();

                expect(
                    shape.validateCoordinatesArray(coordinates1, false, 2, 2)
                ).toBe(true);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates1, true, 2, 2);
                }).not.toThrow();

                expect(
                    shape.validateCoordinatesArray(coordinates2, false, 2, 2)
                ).toBe(true);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates2, true, 2, 2);
                }).not.toThrow();

                expect(
                    shape.validateCoordinatesArray(coordinates1, false, 1, 1)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates1, true, 1, 1);
                }).toThrow(error);

                expect(
                    shape.validateCoordinatesArray(coordinates2, false, 1, 1)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates2, true, 1, 1);
                }).toThrow(error);

                expect(
                    shape.validateCoordinatesArray(coordinates1, false, 3, 3)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates1, true, 3, 3);
                }).toThrow(error);

                expect(
                    shape.validateCoordinatesArray(coordinates2, false, 3, 3)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinatesArray(coordinates2, true, 3, 3);
                }).toThrow(error);

                for (i = 0; i < wrongCoordinates.length; i++) {
                    expect(
                        shape.validateCoordinatesArray(wrongCoordinates[i])
                    ).toBe(false);
                    expect(function () {
                        shape.validateCoordinatesArray(
                            wrongCoordinates[i],
                            true
                        );
                    }).toThrow(error);
                }
            });

            it('get and set coordinates', function () {

                var coordinates1 = [0, 0],
                    coordinates2 = [[0, 0], [10, 10]],
                    shape  = new CanvasShapes.Point([20, 20], 'circle');

                expect(shape.getCoordinates()).toEqual([20, 20]);
                shape.setCoordinates(coordinates1);
                expect(shape.getCoordinates()).toBe(coordinates1);
                shape.setCoordinates(coordinates2);
                expect(shape.getCoordinates()).toBe(coordinates2);
            });

            it('correctly assess coordinates equality', function () {

                var coordinates1 = [[1], [1]],
                    coordinates2 = [[1, 0], [1, 0], [1, 0]],
                    coordinates3 = [[1, 0, 5], [1, 0, 5], [1, 0, 5]],
                    coordinates4 = [[1], []],
                    coordinates5 = [[1, 0], [1], [1, 0]],
                    coordinates6 = [[1, 0], [1, 0, 5], [1, 0, 5]],
                    shape  = new CanvasShapes.Point([20, 20]);

                expect(shape.areCoordinatesEqual(coordinates1)).toBe(true);
                expect(shape.areCoordinatesEqual(coordinates2)).toBe(true);
                expect(shape.areCoordinatesEqual(coordinates3)).toBe(true);

                expect(shape.areCoordinatesEqual(coordinates4)).toBe(false);
                expect(shape.areCoordinatesEqual(coordinates5)).toBe(false);
                expect(shape.areCoordinatesEqual(coordinates6)).toBe(false);
            });
        });
    });
});
