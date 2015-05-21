/*global _, CanvasShapes*/

CanvasShapes.Config = (function () {

    var options = {

        /**
         * Represents the smallest interval between distinguishable numbers.
         * Implementation from: http://stackoverflow.com/a/19052105/571230
         *
         * @type {float}
         */
        EPSILON: (function () {

            var epsilon;

            if ("EPSILON" in Number) {
                return Number.EPSILON;
            }

            epsilon = 1.0;

            // Halve epsilon until we can no longer distinguish
            // 1 + (eps / 2) from 1
            do {
                epsilon /= 2.0;
            }
            while (1.0 + (epsilon / 2.0) != 1.0);

            return epsilon;
        })(),

        /**
         * The maximum difference allowed to assess equality of two numbers,
         * e.g. both `a` and `b` should be considered equal for `a = 4` and
         * `b = 4.000000001`
         *
         * @type {float}
         */
        EQUALITY_ALLOWED_ERROR: 0.0000000001,

        /**
         * It allows you to specify whether coordinates passed to CanvasShapes
         * are pixel-based or relative, i.e. percent-based. You can also set it
         * separetely for each scene.
         *
         * Remember that shapes rendered relatively can be distorted, e.g.
         * rectangle and square can become more like parallelogram and rhombus.
         *
         * @type {boolean}
         */
        relativeRendering: false
    };

    function set(option, value) {

        var property;

        if (_.isString(option)) {
            options[option] = value;
        } else if (_.isObject(option)) {
            for (property in option) {
                set(property, option[property]);
            }
        }
    }

    function get(option) {

        if (!_.isUndefined(options[option])) {
            return options[option];
        }

        return null;
    }

    return {
        set: set,
        get: get
    };
}());
