/*global CanvasShapes*/

CanvasShapes.RenderingAbstract = (function () {

    /**
     * An abstract for all able to be renderered objects.
     *
     * @throws {CanvasShapes.Error} 8001
     */
    var RenderingAbstract = function () {
        throw new CanvasShapes.Error(8001);
    };

    CanvasShapes.Class.extend(
        RenderingAbstract.prototype,
        CanvasShapes.RenderingInterface.prototype,
    {
        _className: 'CanvasShapes.RenderingAbstract',

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {

            // this will initialise handlers if needed
            var handlers = this.getSceneInterfaceHandlers();
            // and this will push handlers to the array so handlers can be used
            this._sceneInterfaceHandlers.push(sceneInterfaceHandlers);
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getSceneInterfaceHandlers: function () {

            var i, availableHandlers;

            if (!CanvasShapes._.isArray(this._sceneInterfaceHandlers)) {

                availableHandlers = [
                    'newLayer',
                    'getLayer',
                    'addShape',
                    'requestRendering',
                    'on',
                    'off',
                    'dispatch'
                ];

                this._sceneInterfaceHandlers = [];

                CanvasShapes._.each(availableHandlers, function (handlerName) {
                    this._sceneInterfaceHandlers[handlerName] =
                        CanvasShapes._.bind(
                            function () {
                                var i,
                                    length = this._sceneInterfaceHandlers.length;

                                for (i = 0; i < length; i++) {
                                    this._sceneInterfaceHandlers[i][handlerName]
                                        .apply(this, arguments);
                                }
                            },
                            this
                        );
                }, this);
            }

            return this._sceneInterfaceHandlers;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setStyle: function (style, deep) {
            this._style = style;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getStyle: function () {
            if (!this._style) {
                this._style = new CanvasShapes.Style();
            }
            return this._style;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        setRelativeRendering: function (relativeRendering) {

            if (CanvasShapes._.isBoolean(relativeRendering)) {
                this._relativeRendering = relativeRendering;
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        getRelativeRendering: function () {
            return !!this._relativeRendering;
        },

        /**
         * @implements {CanvasShapes.RenderingInterface}
         */
        calculateAllowedError: function (layer) {

            var style, definition,
                size = CanvasShapes._.max([
                    layer.getWidth(),
                    layer.getHeight()]
                ),
                isCollidingRatio = this._isCollidingRatio !== undefined ?
                    this._isCollidingRatio :
                    CanvasShapes.Config.get('IS_COLLIDING_RATIO'),
                allowedError = size * isCollidingRatio;

            // add half of lineWidth style property
            style = this.getStyle();
            if (CanvasShapes._.isObject(style)) {
                definition = style.getDefinition();
                if (
                    CanvasShapes._.isObject(definition) &&
                    CanvasShapes._.isNumber(definition.lineWidth)
                ) {
                    if (this.getRelativeRendering()) {
                        allowedError += definition.lineWidth / 2 * size / 100;
                    } else {
                        allowedError += definition.lineWidth / 2;
                    }
                }
            }

            return allowedError;
        }
    });

    return RenderingAbstract;
}());
