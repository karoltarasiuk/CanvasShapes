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
                    CanvasShapes.Tools.removeByIndex(
                        tests[i].array,
                        tests[i].index
                    )
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

        it('hexToRGB method', function () {

            var i,
                cases = [
                    ['', undefined, null],
                    ['#', undefined, null],
                    ['#a', undefined, null],
                    ['#ab', undefined, null],
                    ['#abcd', undefined, null],
                    ['#abcde', undefined, null],
                    ['#123', undefined, { r: 17, g: 34, b: 51 }],
                    ['#123', true, [ 17, 34, 51 ]],
                    ['#abc', undefined, { r: 170, g: 187, b: 204 }],
                    ['#abc', true, [ 170, 187, 204 ]],
                    ['#112233', undefined, { r: 17, g: 34, b: 51 }],
                    ['#112233', true, [ 17, 34, 51 ]],
                    ['#aabbcc', undefined, { r: 170, g: 187, b: 204 }],
                    ['#aabbcc', true, [ 170, 187, 204 ]],
                    ['#aabbcc', true, [ 170, 187, 204 ]]
                ];

            for (i = 0; i < cases.length; i++) {
                expect(CanvasShapes.Tools
                    .hexToRGB(cases[i][0], cases[i][1])).toEqual(cases[i][2]);
            }
        });

        it('rgbToHex method', function () {

            var i,
                cases = [
                    [ undefined, undefined, undefined, null],
                    [ 1, undefined, undefined, null],
                    [ 1, 2, undefined, null],
                    [ 1, 2, 'string', null],
                    [ 1, true, 3, null],
                    [ [], 2, 3, null],
                    [ 17, 34, 51, '#112233'],
                    [ 170, 187, 204, '#aabbcc'],
                    // decimal places are ignored
                    [ 170.437831, 187.123321, 204.75981, '#aabbcc']
                ];

            for (i = 0; i < cases.length; i++) {
                expect(CanvasShapes.Tools
                    .rgbToHex(cases[i][0], cases[i][1], cases[i][2]))
                        .toEqual(cases[i][3]);
            }
        });

        it('arrayToHex method', function () {

            var i,
                cases = [
                    [[], null],
                    [[ 1 ], null],
                    [[ 1, 2 ], null],
                    [[ 1, 2, 'string' ], null],
                    [[ 1, true, 3 ], null],
                    [[ [], 2, 3 ], null],
                    [[ 17, 34, 51 ], '#112233'],
                    [[ 170, 187, 204 ], '#aabbcc']
                ];

            for (i = 0; i < cases.length; i++) {
                expect(CanvasShapes.Tools
                    .arrayToHex(cases[i][0])).toEqual(cases[i][1]);
            }
        });

        it('objectToHex method', function () {

            var i,
                cases = [
                    [{}, null],
                    [{ r: 1 }, null],
                    [{ r: 1, g: 2 }, null],
                    [{ r: 1, g: 2, b: 'string' }, null],
                    [{ r: 1, g: true, b: 3 }, null],
                    [{ r: [], g: 2, b: 3 }, null],
                    [{ r: 17, g: 34, b: 51 }, '#112233'],
                    [{ r: 170, g: 187, b: 204 }, '#aabbcc']
                ];

            for (i = 0; i < cases.length; i++) {
                expect(CanvasShapes.Tools
                    .objectToHex(cases[i][0])).toEqual(cases[i][1]);
            }
        });

        it('colorToHex method', function () {

            var i,
                cases = [
                    ['string', null],
                    [1, null],
                    [null, null],
                    [undefined, null],
                    [[], null],
                    [{}, null]
                ];

            for (i = 0; i < cases.length; i++) {
                expect(CanvasShapes.Tools
                    .colorToHex(cases[i][0])).toEqual(cases[i][1]);
            }

            for (i in PREDEFINED_COLORS) {
                expect(CanvasShapes.Tools
                    .colorToHex(i)).toEqual(PREDEFINED_COLORS[i]);
            }
        });

        it('isValueWithinInterval method', function () {

            var i,
                specs = [{
                    result: false
                }, {
                    value: 1,
                    result: false
                }, {
                    value: 1,
                    min: 0,
                    result: false
                }, {
                    value: 1,
                    min: 0,
                    max: 2,
                    result: true
                }, {
                    value: 1,
                    min: 0,
                    max: 2,
                    excluding: true,
                    result: true
                }, {
                    value: 2,
                    min: 0,
                    max: 2,
                    excluding: true,
                    result: false
                }, {
                    value: 1.9999999,
                    min: 0,
                    max: 2,
                    excluding: true,
                    result: true
                }];

            for (i = 0; i < specs.length; i++) {
                expect(CanvasShapes.Tools.isValueWithinInterval(
                    specs[i].value,
                    specs[i].min,
                    specs[i].max,
                    specs[i].excluding
                )).toBe(specs[i].result);
            }
        });
    });

    /**
     * Copied from `CanvasShapes.Tools` for testing purposes
     */
    var PREDEFINED_COLORS = {
        black:                  '#000000',
        silver:                 '#c0c0c0',
        gray:                   '#808080',
        white:                  '#ffffff',
        maroon:                 '#800000',
        red:                    '#ff0000',
        purple:                 '#800080',
        fuchsia:                '#ff00ff',
        green:                  '#008000',
        lime:                   '#00ff00',
        olive:                  '#808000',
        yellow:                 '#ffff00',
        navy:                   '#000080',
        blue:                   '#0000ff',
        teal:                   '#008080',
        aqua:                   '#00ffff',
        orange:                 '#ffa500',
        aliceblue:              '#f0f8ff',
        antiquewhite:           '#faebd7',
        aquamarine:             '#7fffd4',
        azure:                  '#f0ffff',
        beige:                  '#f5f5dc',
        bisque:                 '#ffe4c4',
        blanchedalmond:         '#ffe4c4',
        blueviolet:             '#8a2be2',
        brown:                  '#a52a2a',
        burlywood:              '#deb887',
        cadetblue:              '#5f9ea0',
        chartreuse:             '#7fff00',
        chocolate:              '#d2691e',
        coral:                  '#ff7f50',
        cornflowerblue:         '#6495ed',
        cornsilk:               '#fff8dc',
        crimson:                '#dc143c',
        darkblue:               '#00008b',
        darkcyan:               '#008b8b',
        darkgoldenrod:          '#b8860b',
        darkgray:               '#a9a9a9',
        darkgreen:              '#006400',
        darkgrey:               '#a9a9a9',
        darkkhaki:              '#bdb76b',
        darkmagenta:            '#8b008b',
        darkolivegreen:         '#556b2f',
        darkorange:             '#ff8c00',
        darkorchid:             '#9932cc',
        darkred:                '#8b0000',
        darksalmon:             '#e9967a',
        darkseagreen:           '#8fbc8f',
        darkslateblue:          '#483d8b',
        darkslategray:          '#2f4f4f',
        darkslategrey:          '#2f4f4f',
        darkturquoise:          '#00ced1',
        darkviolet:             '#9400d3',
        deeppink:               '#ff1493',
        deepskyblue:            '#00bfff',
        dimgray:                '#696969',
        dimgrey:                '#696969',
        dodgerblue:             '#1e90ff',
        firebrick:              '#b22222',
        floralwhite:            '#fffaf0',
        forestgreen:            '#228b22',
        gainsboro:              '#dcdcdc',
        ghostwhite:             '#f8f8ff',
        gold:                   '#ffd700',
        goldenrod:              '#daa520',
        greenyellow:            '#adff2f',
        grey:                   '#808080',
        honeydew:               '#f0fff0',
        hotpink:                '#ff69b4',
        indianred:              '#cd5c5c',
        indigo:                 '#4b0082',
        ivory:                  '#fffff0',
        khaki:                  '#f0e68c',
        lavender:               '#e6e6fa',
        lavenderblush:          '#fff0f5',
        lawngreen:              '#7cfc00',
        lemonchiffon:           '#fffacd',
        lightblue:              '#add8e6',
        lightcoral:             '#f08080',
        lightcyan:              '#e0ffff',
        lightgoldenrodyellow:   '#fafad2',
        lightgray:              '#d3d3d3',
        lightgreen:             '#90ee90',
        lightgrey:              '#d3d3d3',
        lightpink:              '#ffb6c1',
        lightsalmon:            '#ffa07a',
        lightseagreen:          '#20b2aa',
        lightskyblue:           '#87cefa',
        lightslategray:         '#778899',
        lightslategrey:         '#778899',
        lightsteelblue:         '#b0c4de',
        lightyellow:            '#ffffe0',
        limegreen:              '#32cd32',
        linen:                  '#faf0e6',
        mediumaquamarine:       '#66cdaa',
        mediumblue:             '#0000cd',
        mediumorchid:           '#ba55d3',
        mediumpurple:           '#9370db',
        mediumseagreen:         '#3cb371',
        mediumslateblue:        '#7b68ee',
        mediumspringgreen:      '#00fa9a',
        mediumturquoise:        '#48d1cc',
        mediumvioletred:        '#c71585',
        midnightblue:           '#191970',
        mintcream:              '#f5fffa',
        mistyrose:              '#ffe4e1',
        moccasin:               '#ffe4b5',
        navajowhite:            '#ffdead',
        oldlace:                '#fdf5e6',
        olivedrab:              '#6b8e23',
        orangered:              '#ff4500',
        orchid:                 '#da70d6',
        palegoldenrod:          '#eee8aa',
        palegreen:              '#98fb98',
        paleturquoise:          '#afeeee',
        palevioletred:          '#db7093',
        papayawhip:             '#ffefd5',
        peachpuff:              '#ffdab9',
        peru:                   '#cd853f',
        pink:                   '#ffc0cb',
        plum:                   '#dda0dd',
        powderblue:             '#b0e0e6',
        rosybrown:              '#bc8f8f',
        royalblue:              '#4169e1',
        saddlebrown:            '#8b4513',
        salmon:                 '#fa8072',
        sandybrown:             '#f4a460',
        seagreen:               '#2e8b57',
        seashell:               '#fff5ee',
        sienna:                 '#a0522d',
        skyblue:                '#87ceeb',
        slateblue:              '#6a5acd',
        slategray:              '#708090',
        slategrey:              '#708090',
        snow:                   '#fffafa',
        springgreen:            '#00ff7f',
        steelblue:              '#4682b4',
        tan:                    '#d2b48c',
        thistle:                '#d8bfd8',
        tomato:                 '#ff6347',
        turquoise:              '#40e0d0',
        violet:                 '#ee82ee',
        wheat:                  '#f5deb3',
        whitesmoke:             '#f5f5f5',
        yellowgreen:            '#9acd32',
        rebeccapurple:          '#663399'
    };
});
