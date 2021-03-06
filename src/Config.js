/*global CanvasShapes*/

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
         * @see http://karoltarasiuk.com/CanvasShapes/examples/performance/
         *
         * @type {boolean}
         */
        RENDER_OFF_SCREEN: false,

        /**
         * Global setting for allowed error ratio relative to the size of a
         * layer. Can be overwritten separately per each shape. Check
         * `setIsCollidingRatio` in `CanvasShapes.Shape`.
         *
         * @type {float}
         */
        IS_COLLIDING_RATIO: 0.01,

        /**
         * Global setting for minimum animation time. If the time is less than
         * this number, animation won't be performed and desired state of the
         * shape/object will be requested for rendering straight away
         *
         * @type {integer}
         */
        MIN_ANIMATION_TIME: 10
    };

    /**
     * Adds an option to the config.
     *
     * @param {[object,string]} option
     * @param {*}               value [OPTIONAL]
     */
    function set(option, value) {

        var property;

        if (CanvasShapes._.isString(option)) {
            options[option] = value;
        } else if (CanvasShapes._.isObject(option)) {
            for (property in option) {
                set(property, option[property]);
            }
        }
    }

    /**
     * Gets an option from the config.
     *
     * @param  {string} option
     * @return {*}
     */
    function get(option) {

        if (options[option] !== undefined) {
            return options[option];
        }

        return null;
    }

    return {
        set: set,
        get: get
    };
}());
