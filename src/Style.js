/*global _, CanvasShapes*/

CanvasShapes.Style = (function () {

    /**
     * Styling object.
     */
    var Style = function (definition) {

        if (!definition) {
            definition = function () {};
        }

        this.initialise(definition);
    };

    CanvasShapes.Class.extend(
        Style.prototype,
        CanvasShapes.JSONInterface.prototype,
        CanvasShapes.StyleAbstract.prototype,
    {
        className: 'CanvasShapes.Style',

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        toJSON: function (toString) {

            var i,
                obj = {
                    metadata: {
                        className: this.className,
                        UUID: this.getUUID()
                    },
                    data: {
                        definitions: {}
                    }
                };

            for (i in this.definitions) {
                if (!_.isFunction(this.definitions[i])) {
                    obj.data.definitions[i] = this.definitions[i];
                }
            }

            if (toString === true) {
                obj = JSON.stringify(obj);
            }

            return obj;
        },

        /**
         * @implements {CanvasShapes.JSONInterface}
         */
        fromJSON: function (obj) {

            var i, style;

            if (_.isString(obj)) {
                obj = JSON.parse(obj);
            }

            if (
                !_.isObject(obj.metadata) || !_.isObject(obj.data) ||
                !_.isString(obj.metadata.className) ||
                !_.isString(obj.metadata.UUID) ||
                (obj.data.definitions && !_.isArray(obj.data.definitions))
            ) {
                throw new CanvasShapes.Error(1065);
            }

            style = new CanvasShapes.Style();
            CanvasShapes.Class.swapUUID(style.getUUID(), obj.metadata.UUID);

            for (i in obj.data.definitions) {
                style.setDefinition(obj.data.definitions[i], i);
            }

            return style;
        }
    });

    return Style;
}());
