/*global CanvasShapes*/

CanvasShapes.Scene = (function () {

    var Scene = function (config) {
        this.setUUID();
        this._initialise(config);
    };

    CanvasShapes.Class.extend(
        Scene.prototype,
        CanvasShapes.SceneAbstract.prototype,
        CanvasShapes.InteractionAbstract.prototype,
    {

        _className: 'CanvasShapes.Scene',

        /**
         * Scene initialisation method. It accepts the config and validates it.
         *
         * @throws {CanvasShapes.Error} 1001
         * @throws {CanvasShapes.Error} 1005
         *
         * @param {object} config
         */
        _initialise: function (config) {

            if (!this._validateConfig(config)) {
                throw new CanvasShapes.Error(1001);
            }

            this.config = config;
            this._width = this.config.width;
            this._height = this.config.height;

            if (CanvasShapes._.isString(this.config.id)) {
                this._dom = document.getElementById(this.config.id);
            } else {
                this._dom = this.config.element;
            }

            if (!CanvasShapes.Tools.isElement(this._dom)) {
                throw new CanvasShapes.Error(1005);
            }

            // canvas elements inside dom are positioned absolutely
            if (
                this._dom.style.position === '' ||
                this._dom.style.position === 'static'
            ) {
                this._dom.style.position = 'relative';
            }

            this.initialiseListeners();

            // checking whether this scene's layers should be rendered outside
            // of the screen
            if (
                config.RENDER_OFF_SCREEN === true ||
                CanvasShapes.Config.get('RENDER_OFF_SCREEN') === true
            ) {
                this._shouldRenderOffScreen = true;
                this.mainLayer = new CanvasShapes.SceneLayer(this);
                this.mainLayerContext = this.mainLayer.getContext('2d');
            } else {
                this._shouldRenderOffScreen = false;
            }
        },

        /**
         * Checking whether config object is valid
         *
         * @param  {object}  config
         * @return {boolean}
         */
        _validateConfig: function (config) {
            return CanvasShapes._.isObject(config) &&
                CanvasShapes._.isNumber(config.width) &&
                CanvasShapes._.isNumber(config.height) &&
                (CanvasShapes._.isString(config.id) ||
                CanvasShapes.Tools.isElement(config.element));
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        render: function (shape) {

            var i, j, k, layerObject, layer, shapeObject,
                callbacks = [];

            this.initialiseLayers();

            if (shape) {
                for (i in this._layers) {
                    layerObject = this._layers[i];
                    for (j in layerObject.shapes) {
                        if (shape === layerObject.shapes[j]) {
                            layerObject.layer.clear();
                            for (j in layerObject.shapes) {
                                layerObject.shapes[j].render(layerObject.layer);
                            }
                            return;
                        }
                    }
                }
            } else if (CanvasShapes._.isObject(this._requestedRendering)) {

                for (i in this._requestedRendering) {

                    layerObject = this._requestedRendering[i];
                    layer = layerObject.layer;
                    layer.clear();

                    for (j in layerObject.shapes) {

                        shapeObject = this._requestedRendering[i].shapes[j];
                        shape = shapeObject.shape;
                        // if beforeRender was passed we need to run it now
                        if (shapeObject.beforeRender) {
                            shapeObject.beforeRender();
                        }

                        shape.render(layer);

                        // callbacks get executed after clearing all
                        // the shapes from `this._requestedRendering`
                        if (shapeObject.animationFrames) {
                            callbacks.push(shapeObject.animationFrames);
                        }
                        if (shapeObject.callbacks) {
                            callbacks.push(shapeObject.callbacks);
                        }
                    }
                }

                // all shapes were rendered so we can clear this list
                this._requestedRendering = {};

                // if shapes were rendered off screen we need to copy them to
                // the main canvas
                if (this.shouldRenderOffScreen()) {
                    this.mainLayer.clear();
                    for (i in this._layers) {
                        this.mainLayerContext
                            .drawImage(
                                this._layers[i].layer.getCanvas(),
                                this._layers[i].layer.getLeft(),
                                this._layers[i].layer.getTop()
                            );
                    }
                }

                // executing all the callbacks
                for (i = 0; i < callbacks.length; i++) {
                    if (CanvasShapes._.isArray(callbacks[i])) {
                        for (j = 0; j < callbacks[i].length; j++) {
                            callbacks[i][j]();
                        }
                    } else if (CanvasShapes._.isFunction(callbacks[i])) {
                        callbacks[i]();
                    } else if (CanvasShapes._.isObject(callbacks[i])) {
                        for (j in callbacks[i]) {
                            callbacks[i][j].next();
                        }
                    }
                }
            }
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        on: function (eventType, handler, context) {

            if (!context) {
                context = this;
            }

            // remove existing handler
            this.off(handler, eventType, context);

            if (!CanvasShapes._.isArray(this._handlers[eventType])) {
                this._handlers[eventType] = [];
            }

            this._handlers[eventType].push({
                handler: handler,
                context: context === undefined ? this : context
            });
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            var i, j, tempArray;

            for (i in this._handlers) {
                for (j = 0; j < this._handlers[i].length; j++) {

                    if (
                        CanvasShapes._.isString(handlerOrType) &&
                        eventTypeOrContext === undefined &&
                        context === undefined
                    ) {
                        // this.off('some-event-type')
                        if (i === handlerOrType) {
                            // removing all handlers of this type
                            this._handlers[i] = [];
                        }

                    } else if (
                        CanvasShapes._.isFunction(handlerOrType) &&
                        eventTypeOrContext === undefined &&
                        context === undefined
                    ) {
                        // this.off(someHandlerFunction)
                        if (this._handlers[i][j].handler === handlerOrType) {
                            // removing all handlers by matching handler
                            this._handlers[i][j] = null;
                        }

                    } else if (
                        context === undefined &&
                        CanvasShapes._.isObject(eventTypeOrContext)
                    ) {
                        // this.off('some-event-type', contextObject)
                        if (
                            i === handlerOrType &&
                            this._handlers[i][j].context === eventTypeOrContext
                        ) {
                            // removing all handlers by matching type and
                            // context
                            this._handlers[i][j] = null;
                        }

                    } else if (
                        context === undefined &&
                        CanvasShapes._.isString(eventTypeOrContext)
                    ) {
                        // this.off(someHandlerFunction, 'some-event-type')
                        if (
                            i === eventTypeOrContext &&
                            this._handlers[i][j].handler === handlerOrType
                        ) {
                            // removing all handlers by matching handler and
                            // type
                            this._handlers[i][j] = null;
                        }

                    } else {
                        // this.off(someHandlerFunction, 'some-event-type',
                        // contextObject)
                        if (
                            i === eventTypeOrContext &&
                            this._handlers[i][j].handler === handlerOrType &&
                            this._handlers[i][j].context === context
                        ) {
                            // removing all handlers by matching handler, type
                            // and context
                            this._handlers[i][j] = null;
                        }
                    }
                }
            }

            // cleaning up arrays to remove null elements
            for (i in this._handlers) {
                tempArray = [];
                for (j = 0; j < this._handlers[i].length; j++) {
                    if (this._handlers[i][j] !== null) {
                        tempArray.push(this._handlers[i][j]);
                    }
                }
                this._handlers[i] = tempArray;
            }
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        dispatch: function (event, context) {

            var i, handlers, e, type;

            // getting handlers array by event type
            if (
                CanvasShapes._.isObject(event) &&
                CanvasShapes._.isFunction(event.is) &&
                event.is(CanvasShapes.Event)
            ) {
                // already prepared event instance
                if (CanvasShapes._.isArray(this._handlers[event.getType()])) {
                    handlers = this._handlers[event.getType()];
                }

                e = event;
            } else {
                // traditional event or eventType string
                if (
                    CanvasShapes._.isObject(event) &&
                    CanvasShapes._.isString(event.type)
                ) {
                    type = event.type;
                } else if (CanvasShapes._.isString(event)) {
                    type = event;
                }

                if (CanvasShapes._.isArray(this._handlers[type])) {
                    handlers = this._handlers[type];
                }
            }

            if (!handlers) {
                // nothing to dispatch
                return;
            }

            // we create the event object only when it's really needed
            if (handlers.length > 0 && !e) {
                e = CanvasShapes.Event.getInstance(event, this);
            }

            for (i = 0; i < handlers.length; i++) {
                if (
                    context !== undefined &&
                    handlers[i].context !== context
                ) {
                    continue;
                }
                handlers[i].handler.call(handlers[i].context, e);
            }
        }
    });

    return Scene;
}());
