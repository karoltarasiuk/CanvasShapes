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
                    coordinates3 = [
                        (new CanvasShapes.Shape([10, 10])).getUUID(),
                        (new CanvasShapes.Point([20, 20])).getUUID()
                    ],
                    scene = new CanvasShapes.Scene({
                        element: document.createElement('div'),
                        width: 50,
                        height: 50
                    }),
                    layer = new CanvasShapes.SceneLayer(scene, 50, 50),
                    shape = new CanvasShapes.Shape();

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
                    shape = new CanvasShapes.Shape(),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinates(coordinates1)).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true);
                }).not.toThrow();

                expect(shape.validateCoordinates(shape.getUUID())).toBe(true);
                expect(function () { shape.validateCoordinates(shape.getUUID(), true); })
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

                var shape = new CanvasShapes.Shape(),
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

                var shape = new CanvasShapes.Shape(),
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
                }).toThrow(error2);

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
                    shape.translateCoordinates([1, 1, 1], {});
                }).not.toThrow();

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
                        (new CanvasShapes.Shape([10, 10])).getUUID(),
                        (new CanvasShapes.Point([20, 20])).getUUID()
                    ],
                    wrongCoordinates = [
                        [10],
                        {},
                        'a',
                        10,
                        true,
                        []
                    ],
                    shape = new CanvasShapes.Shape(),
                    error = new CanvasShapes.Error(1011);

                expect(shape.validateCoordinates(coordinates1)).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true);
                }).not.toThrow();

                expect(shape.validateCoordinates(coordinates2)).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates2, true);
                }).not.toThrow();

                expect(
                    shape.validateCoordinates(coordinates1, false, 2, 2)
                ).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true, 2, 2);
                }).not.toThrow();

                expect(
                    shape.validateCoordinates(coordinates2, false, 2, 2)
                ).toBe(true);
                expect(function () {
                    shape.validateCoordinates(coordinates2, true, 2, 2);
                }).not.toThrow();

                expect(
                    shape.validateCoordinates(coordinates1, false, 1, 1)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true, 1, 1);
                }).toThrow(error);

                expect(
                    shape.validateCoordinates(coordinates2, false, 1, 1)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinates(coordinates2, true, 1, 1);
                }).toThrow(error);

                expect(
                    shape.validateCoordinates(coordinates1, false, 3, 3)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinates(coordinates1, true, 3, 3);
                }).toThrow(error);

                expect(
                    shape.validateCoordinates(coordinates2, false, 3, 3)
                ).toBe(false);
                expect(function () {
                    shape.validateCoordinates(coordinates2, true, 3, 3);
                }).toThrow(error);

                for (i = 0; i < wrongCoordinates.length; i++) {
                    expect(
                        shape.validateCoordinates(wrongCoordinates[i])
                    ).toBe(false);
                    expect(function () {
                        shape.validateCoordinates(
                            wrongCoordinates[i],
                            true
                        );
                    }).toThrow(error);
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
