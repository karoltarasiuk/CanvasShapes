/*global _, CanvasShapes*/

CanvasShapes.StyleAbstract = (function () {

    /**
     * Abstract for styling objects.
     */
    var StyleAbstract = function () {
        throw new CanvasShapes.Error(8002);
    };

    CanvasShapes.Class.extend(StyleAbstract.prototype, CanvasShapes.StyleInterface.prototype, {

        className: 'CanvasShapes.StyleAbstract',

        definition: null,

        DEFAULT: 'default',

        initialize: function (definition) {
            this.setDefinition(definition, 'default');
        },

        /**
         * Sets the definition for hovered state.
         *
         * @param {object} definition
         */
        setHoverDefinition: function (definition) {
            this.setDefinition(definition, 'hover');
        },

        /**
         * Sets the definition for active state, i.e. element being dragged.
         *
         * @param {object} definition
         */
        setActiveDefinition: function (definition) {
            this.setDefinition(definition, 'active');
        },

        /**
         * Sets the definition for custom state.
         *
         * @param {object} definition
         * @param {string} which
         */
        setDefinition: function (definition, which) {

            if (!this.definitions) {
                this.definitions = {};
            }

            this.definitions[which] = definition;
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        set: function (layer, which) {

            var context = layer.getContext();

            if (!which) {
                which = this.DEFAULT;
            }

            if (this.definitions[which] && this.definitions[which].stroke) {
                context.stroke();
            }

            if (this.definitions[which] && this.definitions[which].fill) {
                context.fill();
            }
        }
    });

    return StyleAbstract;
}());
