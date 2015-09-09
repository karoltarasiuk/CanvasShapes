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

        it('uuid method', function () {

            var temp, i,
                regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            for(i = 0; i < 100; i++) {
                temp = CanvasShapes.Tools.uuid();
                expect(regex.test(temp)).toBe(true);
            }
        });
    });
});
