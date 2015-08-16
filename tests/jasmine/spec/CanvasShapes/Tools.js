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

    describe('CanvasShapes.Tools', function () {

        it('removeByIndex method', function () {

            var i,
                tests = [
                    {
                        array: [],
                        index: 1,
                        result: []
                    },
                    {
                        array: [0, 1],
                        index: 1,
                        result: [0]
                    },
                    {
                        array: [0, 1],
                        index: 3,
                        result: [0, 1]
                    },
                    {
                        array: [0, 1, 2],
                        index: 1,
                        result: [0, 2]
                    }
                ];

            for (i = 0; i < tests.length; i++) {
                expect(
                    CanvasShapes.Tools.removeByIndex(tests[i].array, tests[i].index)
                ).toEqual(tests[i].result);
            }
        });
    });
});
