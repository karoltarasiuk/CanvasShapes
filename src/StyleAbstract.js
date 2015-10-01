/*global _, CanvasShapes*/

CanvasShapes.StyleAbstract = (function () {

    /**
     * Abstract for styling objects.
     */
    var StyleAbstract = function () {
        throw new CanvasShapes.Error(8002);
    };

    CanvasShapes.Class.extend(
        StyleAbstract.prototype,
        CanvasShapes.StyleInterface.prototype,
    {
        className: 'CanvasShapes.StyleAbstract',

        definitions: null,

        DEFAULT: 'default',

        /**
         * Initializes the style with default definition.
         *
         * The `definition` is a function accepting a `context` of a layer, e.g:
         * ```
         * function (context) {
         *     context.stroke();
         * }
         * ```
         *
         * @param {function} definition
         */
        initialize: function (definition) {

            this.definitions = [];
            this.setDefinition(definition, 'default');
        },

        /**
         * Sets the definition for hovered state.
         *
         * The `definition` is a function accepting a `context` of a layer, e.g:
         * ```
         * function (context) {
         *     context.stroke();
         * }
         * ```
         *
         * @param {function} definition
         */
        setHoverDefinition: function (definition) {
            this.setDefinition(definition, 'hover');
        },

        /**
         * Sets the definition for active state, i.e. element being dragged.
         *
         * The `definition` is a function accepting a `context` of a layer, e.g:
         * ```
         * function (context) {
         *     context.stroke();
         * }
         * ```
         *
         * @param {function} definition
         */
        setActiveDefinition: function (definition) {
            this.setDefinition(definition, 'active');
        },

        /**
         * Sets the definition for custom state.
         *
         * The `definition` is a function accepting a `context` of a layer, e.g:
         * ```
         * function (context) {
         *     context.stroke();
         * }
         * ```
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
         *
         * @param {function} definition
         * @param {string}   which
         */
        setDefinition: function (definition, which) {

            if (!_.isFunction(definition)) {
                throw new CanvasShapes.Error(1048);
            }

            this.definitions[which] = definition;
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        set: function (layer, which) {

            var context = layer.getContext();

            if (!_.isString(which)) {
                which = this.DEFAULT;
            }

            if (this.definitions[which]) {
                this.definitions[which](context);
            }
        }
    });

    return StyleAbstract;
}());
