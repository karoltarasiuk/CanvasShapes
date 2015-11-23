/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.Scene = (function () {

    var sceneConfigSpecification, sceneConfigChecker, Scene;

    sceneConfigSpecification = [{
        type: 'object',
        properties: [{
            name: 'id',
            spec: { type: 'string' }
        }, {
            name: 'width',
            spec: { type: 'number' }
        }, {
            name: 'height',
            spec: { type: 'number' }
        }]
    }, {
        type: 'object',
        properties: [{
            name: 'element'
        }, {
            name: 'width',
            spec: { type: 'number' }
        }, {
            name: 'height',
            spec: { type: 'number' }
        }]
    }];
    sceneConfigChecker = new JSONChecker(sceneConfigSpecification);

    Scene = function (config) {
        this.setUUID();

        if (!this.validateConfig(config)) {
            throw new CanvasShapes.Error(1001);
        }

        this.initialize(config);
    };

    CanvasShapes.Class.extend(
        Scene.prototype,
        CanvasShapes.SceneAbstract.prototype,
        CanvasShapes.InteractionAbstract.prototype,
    {

        className: 'CanvasShapes.Scene',

        initialize: function (config) {

            this.config = config;
            this.width = this.config.width;
            this.height = this.config.height;

            if (_.isString(this.config.id)) {
                this.dom = document.getElementById(this.config.id);
            } else {
                this.dom = this.config.element;
            }

            if (!this.dom) {
                throw new CanvasShapes.Error(1005);
            }

            // canvas elements inside dom are positioned absolutely
            if (
                this.dom.style.position === '' ||
                this.dom.style.position === 'static'
            ) {
                this.dom.style.position = 'relative';
            }

            this.initializeListeners();

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

        validateConfig: function (config) {

            return sceneConfigChecker.check(config);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        render: function (shape) {

            var i, j, k, layerObject, layer, shapeObject,
                callbacks = [];

            this.initializeLayers();

            if (shape) {
                for (i in this.layers) {
                    layerObject = this.layers[i];
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
            } else if (_.isObject(this.requestedRendering)) {

                for (i in this.requestedRendering) {

                    layerObject = this.requestedRendering[i];
                    layer = layerObject.layer;
                    layer.clear();

                    for (j in layerObject.shapes) {

                        shapeObject = this.requestedRendering[i].shapes[j];
                        shape = shapeObject.shape;
                        shape.render(layer);

                        // callbacks get executed after clearing all
                        // the shapes from `this.requestedRendering`
                        callbacks.push(shapeObject.animationFrames);
                    }
                }

                // all shapes were rendered so we can clear this list
                this.requestedRendering = {};

                // if shapes were rendered off screen we need to copy them to
                // the main canvas
                if (this.shouldRenderOffScreen()) {
                    this.mainLayer.clear();
                    for (i in this.layers) {
                        this.mainLayerContext
                            .drawImage(this.layers[i].layer.getCanvas(), 0, 0);
                    }
                }

                // executing all the callbacks
                for (i = 0; i < callbacks.length; i++) {
                    if (_.isObject(callbacks[i])) {
                        for (j in callbacks[i]) {
                            callbacks[i][j].next();
                        }
                    } else {
                        callbacks[i]();
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

            if (!_.isArray(this.handlers[eventType])) {
                this.handlers[eventType] = [];
            }

            this.handlers[eventType].push({
                handler: handler,
                context: _.isUndefined(context) ? this : context
            });
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        off: function (handlerOrType, eventTypeOrContext, context) {

            var i, j, tempArray;

            for (i in this.handlers) {
                for (j = 0; j < this.handlers[i].length; j++) {

                    if (
                        _.isString(handlerOrType) &&
                        _.isUndefined(eventTypeOrContext) &&
                        _.isUndefined(context)
                    ) {
                        // this.off('some-event-type')
                        if (i === handlerOrType) {
                            // removing all handlers of this type
                            this.handlers[i] = [];
                        }

                    } else if (
                        _.isFunction(handlerOrType) &&
                        _.isUndefined(eventTypeOrContext) &&
                        _.isUndefined(context)
                    ) {
                        // this.off(someHandlerFunction)
                        if (this.handlers[i][j].handler === handlerOrType) {
                            // removing all handlers by matching handler
                            this.handlers[i][j] = null;
                        }

                    } else if (
                        _.isUndefined(context) &&
                        _.isObject(eventTypeOrContext)
                    ) {
                        // this.off('some-event-type', contextObject)
                        if (
                            i === handlerOrType &&
                            this.handlers[i][j].context === eventTypeOrContext
                        ) {
                            // removing all handlers by matching type and
                            // context
                            this.handlers[i][j] = null;
                        }

                    } else if (
                        _.isUndefined(context) &&
                        _.isString(eventTypeOrContext)
                    ) {
                        // this.off(someHandlerFunction, 'some-event-type')
                        if (
                            i === eventTypeOrContext &&
                            this.handlers[i][j].handler === handlerOrType
                        ) {
                            // removing all handlers by matching handler and
                            // type
                            this.handlers[i][j] = null;
                        }

                    } else {
                        // this.off(someHandlerFunction, 'some-event-type',
                        // contextObject)
                        if (
                            i === eventTypeOrContext &&
                            this.handlers[i][j].handler === handlerOrType &&
                            this.handlers[i][j].context === context
                        ) {
                            // removing all handlers by matching handler, type
                            // and context
                            this.handlers[i][j] = null;
                        }
                    }
                }
            }

            // cleaning up arrays to remove null elements
            for (i in this.handlers) {
                tempArray = [];
                for (j = 0; j < this.handlers[i].length; j++) {
                    if (this.handlers[i][j] !== null) {
                        tempArray.push(this.handlers[i][j]);
                    }
                }
                this.handlers[i] = tempArray;
            }
        },

        /**
         * @implements {CanvasShapes.InteractionInterface}
         */
        dispatch: function (event, context) {

            var i, handlers, e, type;

            // getting handlers array by event type
            if (
                _.isObject(event) && _.isFunction(event.is) &&
                event.is(CanvasShapes.Event)
            ) {
                // already prepared event instance
                if (_.isArray(this.handlers[event.getType()])) {
                    handlers = this.handlers[event.getType()];
                }

                e = event;
            } else {
                // traditional event or eventType string
                if (_.isObject(event) && _.isString(event.type)) {
                    type = event.type;
                } else if (_.isString(event)) {
                    type = event;
                }

                if (_.isArray(this.handlers[type])) {
                    handlers = this.handlers[type];
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
                    !_.isUndefined(context) &&
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
