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
         * Decides whether layers should be rendered off screen and copied into
         * the final layer placed in the scene container, or on screen in the
         * scene container. The latter seems to be faster, hence default is
         * `false`.
         *
         * @type {boolean}
         */
        RENDER_OFF_SCREEN: false,
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
