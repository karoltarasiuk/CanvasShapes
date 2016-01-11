/*global CanvasShapes*/

CanvasShapes.Tools = (function () {

    /**
     * Wrapper for `Array.prototype.slice` method.
     *
     * @param  {array}   array
     * @param  {integer} index
     *
     * @return {array}
     */
    function removeByIndex(array, index) {
        if (CanvasShapes._.isArray(array) && array.splice) {
            array.splice(index, 1);
        }
        return array;
    }

    /**
     * Checks if passed value is a DOM node, e.g. element, attribute, text. For
     * `null` and `undefined` it returns passed value.
     *
     * @source http://stackoverflow.com/a/384380/571230
     *
     * @param  {anything} o
     * @return {boolean}
     */
    function isNode(o){
        return (
            typeof Node === "object" ? o instanceof Node :
            o && typeof o === "object" && typeof o.nodeType === "number" &&
            typeof o.nodeName==="string"
        );
    }

    /**
     * Checks if passed value is a DOM elmeent, e.g. DIV, P, A and so on. For
     * `null` and `undefined` it returns passed value.
     *
     * @source http://stackoverflow.com/a/384380/571230
     *
     * @param  {anything} o
     * @return {boolean}
     */
    function isElement(o){
        return !!(
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 &&
            typeof o.nodeName==="string"
        );
    }

    /**
     * Converts hex notation to object, or optionally to array if
     * `convertToArray` is passed as a truthy value.
     *
     * @param  {string}  hex
     * @param  {boolean} convertToArray [OPTIONAL]
     *
     * @return {[object,array]}
     */
    function hexToRGB(hex, convertToArray) {

        if (
            !CanvasShapes._.isString(hex) ||
            (hex.length !== 7 && hex.length !== 4)
        ) {
            return null;
        }

        // @see http://stackoverflow.com/a/5624139/571230
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            return null;
        }

        if (convertToArray) {
            return [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ];
        } else {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
    }

    /**
     * Convert array of numbers to hex notation in lowercase.
     *
     * @param  {array} arr
     * @return {string}
     */
    function arrayToHex(arr) {

        if (
            !CanvasShapes._.isArray(arr) || !CanvasShapes._.isNumber(arr[0]) ||
            !CanvasShapes._.isNumber(arr[1]) || !CanvasShapes._.isNumber(arr[2])
        ) {
            return null;
        }

        return rgbToHex.apply(null, arr);
    }

    /**
     * Convert object with r, g and b properties to hex notation in lowercase.
     *
     * @param  {object} obj
     * @return {string}
     */
    function objectToHex(obj) {

        if (
            !CanvasShapes._.isObject(obj) || !CanvasShapes._.isNumber(obj.r) ||
            !CanvasShapes._.isNumber(obj.g) || !CanvasShapes._.isNumber(obj.b)
        ) {
            return null;
        }

        return rgbToHex(obj.r, obj.g, obj.b);
    }

    /**
     * Convert 3 integers (arguments) to hex notation in lowercase.
     *
     * @param  {integer} r
     * @param  {integer} g
     * @param  {integer} b
     *
     * @return {string}
     */
    function rgbToHex(r, g, b) {

        if (
            !CanvasShapes._.isNumber(r) ||
            !CanvasShapes._.isNumber(g) ||
            !CanvasShapes._.isNumber(b)
        ) {
            return null;
        }

        // @see http://stackoverflow.com/a/5624139/571230
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16).slice(1).substr(0, 6);
    }

    function colorToHex(color) {

        if (!CanvasShapes._.isString(PREDEFINED_COLORS[color])) {
            return null;
        }

        return PREDEFINED_COLORS[color];
    }

    /**
     * Checks whether passed value is within a given interval.
     * `excludingEndpoints` defaults to false.
     *
     * @param  {float}   value
     * @param  {float}   intervalMin
     * @param  {float}   intervalMax
     * @param  {boolean} excludingEndpoints [OPTIONAL]
     *
     * @return {boolean}
     */
    function isValueWithinInterval(
        value,
        intervalMin,
        intervalMax,
        excludingEndpoints
    ) {
        var temp;

        if (
            !CanvasShapes._.isNumber(value) ||
            !CanvasShapes._.isNumber(intervalMin) ||
            !CanvasShapes._.isNumber(intervalMax)
        ) {
            return false;
        }

        // swapping values if max is bigger
        if (intervalMax < intervalMin) {
            temp = intervalMin;
            intervalMin = intervalMax;
            intervalMax = temp;
        }

        if (excludingEndpoints) {
            return value > intervalMin && value < intervalMax;
        } else {
            return value >= intervalMin && value <= intervalMax;
        }
    }

    /**
     * Checks whether passed string is a valid UUID
     *
     * @param  {string}  uuid
     * @return {boolean}
     */
    function isuuid(uuid) {
        var regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return CanvasShapes._.isString(uuid) && !!regexp.exec(uuid);
    }

    /**
     * Methods exposed from this module.
     *
     * @type {object}
     */
    var EXPOSED = {
        removeByIndex: removeByIndex,
        isNode: isNode,
        isElement: isElement,
        uuid: uuid,
        hexToRGB: hexToRGB,
        arrayToHex: arrayToHex,
        objectToHex: objectToHex,
        rgbToHex: rgbToHex,
        colorToHex: colorToHex,
        isValueWithinInterval: isValueWithinInterval,
        isuuid: isuuid
    };

    /**
     * Color pre-defined strings, and their hex values.
     *
     * @see  https://developer.mozilla.org/en/docs/Web/CSS/color_value
     * @type {object}
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

    return EXPOSED;
})();
