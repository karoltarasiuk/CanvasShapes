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
        HOVER: 'hover',
        ACTIVE: 'active',

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

            this.shapes = [];
            this.definitions = [];
            this.setDefinition(definition, this.DEFAULT);
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
            this.setDefinition(definition, this.HOVER);
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
            this.setDefinition(definition, this.ACTIVE);
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

            if (!which) {
                which = this.DEFAULT;
            }

            if (
                !_.isString(which) ||
                (
                    !_.isFunction(definition) &&
                    (!_.isObject(definition) || _.isArray(definition))
                )
            ) {
                throw new CanvasShapes.Error(1048);
            }

            this.definitions[which] = definition;
        },

        /**
         * Gets the hover definition.
         *
         * @return {[object,function]}
         */
        getHoverDefinition: function () {
            return this.getDefinition(this.HOVER);
        },

        /**
         * Gets the active definition.
         *
         * @return {[object,function]}
         */
        getActiveDefinition: function () {
            return this.getDefinition(this.ACTIVE);
        },

        /**
         * Fetches the existing definition.
         *
         * @param  {string}            which [OPTIONAL]
         * @return {[object,function]}
         */
        getDefinition: function (which) {

            if (!which) {
                which = this.DEFAULT;
            }

            if (!_.isString(which) || !_.isObject(this.definitions[which])) {
                throw new CanvasShapes.Error(1051);
            }

            return this.definitions[which];
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        set: function (layer, which) {

            var context = layer.getContext(),
                definitionFunction;

            if (!_.isString(which)) {
                which = this.DEFAULT;
            }

            if (_.isFunction(this.definitions[which])) {
                definitionFunction = this.definitions[which];
            } else {
                definitionFunction = _.bind(function (context) {
                    if (this.definitions[which].strokeStyle) {
                        context.strokeStyle = this.definitions[which].strokeStyle;
                        context.stroke();
                    }
                    if (this.definitions[which].fillStyle) {
                        context.fillStyle = this.definitions[which].fillStyle;
                        context.fill();
                    }
                }, this);
            }

            definitionFunction(context);
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        addToShapes: function (shapes, deep) {

            var i;

            if (deep && !_.isBoolean(deep)) {
                throw new CanvasShapes.Error(1052);
            }

            if (!_.isArray(shapes)) {
                shapes = [shapes];
            }

            for (i = 0; i < shapes.length; i++) {
                if (
                    !_.isObject(shapes[i]) || !_.isFunction(shapes[i].is) ||
                    !shapes[i].is(CanvasShapes.RenderingInterface)
                ) {
                    throw new CanvasShapes.Error(1052);
                } else {
                    shapes[i].setStyle(this, deep);
                    this.shapes.push(shapes[i]);
                }
            }
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        animate: function (
            totalAnimationTime,
            definitionObject,
            callback,
            which
        ) {
            var that = this;

            if (!which) {
                which = this.DEFAULT;
            }

            if (
                (callback && !_.isFunction(callback)) ||
                !_.isNumber(totalAnimationTime) ||
                !_.isString(which) || !_.isObject(this.definitions[which]) ||
                !(_.isObject(definitionObject) && !_.isArray(definitionObject))
            ) {
                throw new CanvasShapes.Error(1050);
            }

            // for each shape using this style we execute the same animation
            _.each(this.shapes, function (shape) {
                shape.animate(new CanvasShapes.AnimationFrame(
                    shape,
                    totalAnimationTime,
                    function (currentTime) {

                        var newDefinition = {},
                            ratio = currentTime / this.totalAnimationTime,
                            calculateCurrentColor = function (
                                baseColor,
                                desiredColor,
                                ratio
                            ) {
                                var newColor = {};

                                if (CanvasShapes.Tools.colorToHex(baseColor)) {
                                    baseColor =
                                        CanvasShapes.Tools.colorToHex(baseColor);
                                }

                                if (CanvasShapes.Tools.colorToHex(desiredColor)) {
                                    desiredColor =
                                        CanvasShapes.Tools.colorToHex(desiredColor);
                                }

                                baseColor = CanvasShapes.Tools.hexToRGB(baseColor);
                                desiredColor =
                                    CanvasShapes.Tools.hexToRGB(desiredColor);

                                if (
                                    !_.isObject(baseColor) ||
                                    !_.isObject(desiredColor)
                                ) {
                                    return baseColor;
                                }

                                newColor.r = baseColor.r +
                                    (desiredColor.r - baseColor.r) * ratio;
                                newColor.g = baseColor.g +
                                    (desiredColor.g - baseColor.g) * ratio;
                                newColor.b = baseColor.b +
                                    (desiredColor.b - baseColor.b) * ratio;

                                return CanvasShapes.Tools.objectToHex(newColor);
                            };

                        if (_.isNaN(ratio) || ratio > 1) {
                            ratio = 1;
                        }

                        if (this.variables.definition.strokeStyle) {
                            if (this.variables.baseDefinition.strokeStyle) {
                                newDefinition.strokeStyle = calculateCurrentColor(
                                    this.variables.baseDefinition.strokeStyle,
                                    this.variables.definition.strokeStyle,
                                    ratio
                                );
                            } else {
                                newDefinition.strokeStyle =
                                    this.variables.definition.strokeStyle;
                            }
                        }

                        if (this.variables.definition.fillStyle) {
                            if (this.variables.baseDefinition.fillStyle) {
                                newDefinition.fillStyle = calculateCurrentColor(
                                    this.variables.baseDefinition.fillStyle,
                                    this.variables.definition.fillStyle,
                                    ratio
                                );
                            } else {
                                newDefinition.fillStyle =
                                    this.variables.definition.fillStyle;
                            }
                        }

                        this.variables.style.setDefinition(
                            newDefinition,
                            this.variables.which
                        );
                    },
                    callback,
                    {
                        definition: definitionObject,
                        baseDefinition: that.definitions[which],
                        which: which,
                        style: that
                    },
                    'style'
                ));
            });
        }
    });

    return StyleAbstract;
}());
