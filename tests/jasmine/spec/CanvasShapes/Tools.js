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

        it('isNode method', function () {

            var div = document.createElement('div'),
                p = document.createElement('p'),
                a = document.createElement('a'),
                span = document.createElement('span'),
                text = document.createTextNode('text'),
                attr = document.createAttribute('attr');

            expect(CanvasShapes.Tools.isNode(div)).toBe(true);
            expect(CanvasShapes.Tools.isNode(p)).toBe(true);
            expect(CanvasShapes.Tools.isNode(a)).toBe(true);
            expect(CanvasShapes.Tools.isNode(span)).toBe(true);
            expect(CanvasShapes.Tools.isNode(text)).toBe(true);
            expect(CanvasShapes.Tools.isNode(attr)).toBe(true);
            expect(CanvasShapes.Tools.isNode(null)).toBe(null);
            expect(CanvasShapes.Tools.isNode(undefined)).toBe(undefined);
            expect(CanvasShapes.Tools.isNode(true)).toBe(false);
            expect(CanvasShapes.Tools.isNode(1)).toBe(false);
            expect(CanvasShapes.Tools.isNode('string')).toBe(false);
            expect(CanvasShapes.Tools.isNode({})).toBe(false);
            expect(CanvasShapes.Tools.isNode([])).toBe(false);
        });

        it('isElement method', function () {

            var div = document.createElement('div'),
                p = document.createElement('p'),
                a = document.createElement('a'),
                span = document.createElement('span'),
                text = document.createTextNode('text'),
                attr = document.createAttribute('attr');

            expect(CanvasShapes.Tools.isElement(div)).toBe(true);
            expect(CanvasShapes.Tools.isElement(p)).toBe(true);
            expect(CanvasShapes.Tools.isElement(a)).toBe(true);
            expect(CanvasShapes.Tools.isElement(span)).toBe(true);
            expect(CanvasShapes.Tools.isElement(text)).toBe(false);
            expect(CanvasShapes.Tools.isElement(attr)).toBe(false);
            expect(CanvasShapes.Tools.isElement(null)).toBe(null);
            expect(CanvasShapes.Tools.isElement(undefined)).toBe(undefined);
            expect(CanvasShapes.Tools.isElement(true)).toBe(false);
            expect(CanvasShapes.Tools.isElement(1)).toBe(false);
            expect(CanvasShapes.Tools.isElement('string')).toBe(false);
            expect(CanvasShapes.Tools.isElement({})).toBe(false);
            expect(CanvasShapes.Tools.isElement([])).toBe(false);
        });
    });
});
