/*global CanvasShapes*/

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
        _className: 'CanvasShapes.StyleAbstract',

        definitions: null,

        DEFAULT: 'default',
        HOVER: 'hover',
        ACTIVE: 'active',

        /**
         * Initialises the style with default definition.
         *
         * The `definition` is a function accepting a `context` of a layer, e.g:
         * ```
         * function (context) {
         *     context.stroke();
         * }
         * ```
         * or it's an object with definition properties, e.g.:
         * ```
         * {
         *     strokeStyle: 'black',
         *     fillStyle: 'white'
         * }
         * ```
         *
         * [WARNING] Definition object is not as flexible, but colors specified
         * there can be animated.
         *
         * @param {[function, object]} definition
         */
        _initialise: function (definition) {

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
         * @throws {CanvasShapes.Error} 1048
         *
         * @param {function} definition
         * @param {string}   which
         */
        setDefinition: function (definition, which) {

            if (!which) {
                which = this.DEFAULT;
            }

            if (
                !CanvasShapes._.isString(which) ||
                (
                    !CanvasShapes._.isFunction(definition) &&
                    (!CanvasShapes._.isObject(definition) ||
                        CanvasShapes._.isArray(definition))
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
         * @throws {CanvasShapes.Error} 1051
         *
         * @param  {string}            which [OPTIONAL]
         * @return {[object,function]}
         */
        getDefinition: function (which) {

            if (!which) {
                which = this.DEFAULT;
            }

            if (
                !CanvasShapes._.isString(which) ||
                !CanvasShapes._.isObject(this.definitions[which])
            ) {
                throw new CanvasShapes.Error(1051);
            }

            return this.definitions[which];
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         */
        set: function (layer, relativeRendering, which) {

            var context = layer.getContext(),
                definitionFunction;

            if (!CanvasShapes._.isString(which)) {
                which = this.DEFAULT;
            }

            if (CanvasShapes._.isFunction(this.definitions[which])) {
                definitionFunction = this.definitions[which];
            } else {
                definitionFunction = CanvasShapes._.bind(
                    function (layer, relativeRendering, context) {
                        if (this.definitions[which].strokeStyle) {
                            context.strokeStyle =
                                this.definitions[which].strokeStyle;
                            if (this.definitions[which].lineWidth) {
                                if (relativeRendering) {
                                    context.lineWidth =
                                        this.definitions[which].lineWidth *
                                        layer.getWidth() / 100;
                                } else {
                                    context.lineWidth =
                                        this.definitions[which].lineWidth;
                                }
                            }
                            context.stroke();
                        }
                        if (this.definitions[which].fillStyle) {
                            context.fillStyle =
                                this.definitions[which].fillStyle;
                            context.fill();
                        }
                    },
                    this,
                    layer,
                    relativeRendering
                );
            }

            definitionFunction(context);
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         *
         * @throws {CanvasShapes.Error} 1052
         */
        addToShapes: function (shapes, deep) {

            var i;

            if (deep && !CanvasShapes._.isBoolean(deep)) {
                throw new CanvasShapes.Error(1052);
            }

            if (!CanvasShapes._.isArray(shapes)) {
                shapes = [shapes];
            }

            for (i = 0; i < shapes.length; i++) {
                if (
                    !CanvasShapes._.isObject(shapes[i]) ||
                    !CanvasShapes._.isFunction(shapes[i].is) ||
                    !shapes[i].is(CanvasShapes.RenderingInterface)
                ) {
                    throw new CanvasShapes.Error(1052);
                }

                shapes[i].setStyle(this, deep);
                this.shapes.push(shapes[i]);
            }
        },

        /**
         * @implements {CanvasShapes.StyleInterface}
         *
         * @throws {CanvasShapes.Error} 1050
         */
        animate: function (
            totalAnimationTime,
            definitionObject,
            callback,
            which
        ) {
            var that = this,
                stepCallback = function (currentTime) {
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
                                !CanvasShapes._.isObject(baseColor) ||
                                !CanvasShapes._.isObject(desiredColor)
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

                    if (CanvasShapes._.isNaN(ratio) || ratio > 1) {
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
                };

            if (!which) {
                which = this.DEFAULT;
            }

            if (
                (callback && !CanvasShapes._.isFunction(callback)) ||
                !CanvasShapes._.isNumber(totalAnimationTime) ||
                !CanvasShapes._.isString(which) ||
                !CanvasShapes._.isObject(this.definitions[which]) ||
                !(CanvasShapes._.isObject(definitionObject) &&
                    !CanvasShapes._.isArray(definitionObject))
            ) {
                throw new CanvasShapes.Error(1050);
            }

            // for each shape using this style we execute the same animation
            CanvasShapes._.each(this.shapes, function (shape) {
                shape.animate(new CanvasShapes.AnimationFrame(
                    shape,
                    totalAnimationTime,
                    stepCallback,
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
