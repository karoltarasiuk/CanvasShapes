/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneAbstract = (function () {

    var SceneAbstract = function () {
        throw new CanvasShapes.Error(8007);
    };

    CanvasShapes.Class.extend(SceneAbstract.prototype, CanvasShapes.SceneInterface.prototype, {

        className: 'CanvasShapes.SceneAbstract',

        /**
         * DOM element containing whole scene. Must be set on initialisation.
         *
         * @type {object}
         */
        dom: null,

        /**
         * Width of the scene. Must be set on initialisation.
         *
         * @type {integer}
         */
        width: null,

        /**
         * Height of the scene. Must be set on initialisation.
         *
         * @type {integer}
         */
        height: null,

        /**
         * Layers available within a scene. It's an array of objects in
         * following format:
         * {
         *     layer: CanvasShapes.SceneLayerInterface
         *     shapes: [CanvasShapes.ShapeInterface]
         * }
         *
         * @type {array}
         */
        layers: null,

        /**
         * All the attached event handlers divided by event type in a following
         * format:
         *
         * {
         *     click: [
         *         {
         *             handler: function,
         *             context: object
         *         },
         *         ...
         *     ],
         *     ...
         * }
         *
         * @type {object}
         */
        handlers: null,

        /**
         * Initializes event listeners. Call ONLY when `this.dom` is ready!
         */
        initializeListeners: function () {
            if (!this.dom || !this.dom.addEventListener) {
                throw new CanvasShapes.Error(1027);
            }

            this.handlers = {};
            CanvasShapes.Event.initializeListeners(this);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        newLayer: function (shape, width, height, left, top) {

            var layerObject,
                layer = new CanvasShapes.SceneLayer(this, width, height, left, top);

            if (shape && !shape.is(CanvasShapes.ShapeInterface)) {
                throw new CanvasShapes.Error(1019);
            }

            if (shape) {
                this.addShape(shape, layer);
            } else {
                this.initializeLayers();
            }

            return layer;
        },

        /**
         * Initialize array of layers creating one default
         */
        initializeLayers: function () {

            if (!_.isArray(this.layers)) {
                this.layers = [];
                this.layers.push({
                    layer: new CanvasShapes.SceneLayer(this),
                    shapes: []
                });
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        addShape: function (shape, layer) {

            var i, layerObject;

            this.initializeLayers();

            if (layer && !layer.is(CanvasShapes.SceneLayerInterface)) {
                throw new CanvasShapes.Error(1022);
            }

            if (!layer) {
                layer = this.getLayer();
            }

            if (shape && shape.is && shape.is(CanvasShapes.ShapeInterface)) {
                // retrieving current layer object for this shape
                layerObject = this.getLayerObject(shape);
                if (layerObject) {
                    // removing shape from this layer obj and adding to new
                    for (i = 0; i < layerObject.shapes.length; i++) {
                        if (layerObject.shapes[i] === shape) {
                            layerObject.shapes.splice(i, 1);
                        }
                    }
                }
                // need to set new layer for passed shape
                // checking whether layer aready exists
                layerObject = this.getLayerObject(layer);
                if (layerObject) {
                    layerObject.shapes.push(shape);
                // couldn't find, need to set new
                } else {
                    this.layers.push({
                        layer: layer,
                        shapes: [shape]
                    });
                }

                // setting scene handlers
                shape.setSceneInterfaceHandlers(this.getSceneInterfaceHandlers());
            } else {
                throw new CanvasShapes.Error(1020);
            }

            return layer;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getLayer: function (shapeOrLayer) {

            var layerObject = this.getLayerObject(shapeOrLayer);

            if (layerObject) {
                return layerObject.layer;
            }

            return null;
        },

        /**
         * Allows you to retrieve a layer specific for a shape or layer.
         * If `shapeOrLayer` is null it will return default layer for a scene.
         * getLayer called without any arguments should ALWAYS return a
         * layerObject.
         *
         * @param {[CanvasShapes.ShapeInterface,CanvasShapes.SceneLayerInterface]} shapeOrLayer [OPTIONAL]
         * @return {[null,object]} format:
         * {
         *     layer: CanvasShapes.SceneLayerInterface
         *     shapes: [CanvasShapes.ShapeInterface]
         * }
         */
        getLayerObject: function (shapeOrLayer) {

            var i, temp;

            this.initializeLayers();

            // finding the default layer
            if (shapeOrLayer === undefined) {
                // returning first empty layer
                temp = _.find(this.layers, function (layerObj) {
                    return layerObj.shapes.length === 0;
                });
                // if there is no layer with no shape we return the first one
                // which most possibly is default one
                if (!temp) {
                    temp = this.layers[0];
                }

            // finding by shape
            } else if (
                _.isObject(shapeOrLayer) && shapeOrLayer.is &&
                shapeOrLayer.is(CanvasShapes.ShapeInterface) &&
                _.isArray(this.layers)
            ) {

                temp = _.find(this.layers, function (layerObj) {

                    var foundShape;

                    if (_.isArray(layerObj.shapes)) {

                        foundShape = _.find(layerObj.shapes, function (shapeObj) {
                            return shapeObj === shapeOrLayer;
                        });
                    }

                    if (foundShape) {
                        return true;
                    }

                    return false;
                });

            // finding by layer
            } else if (
                _.isObject(shapeOrLayer) && shapeOrLayer.is &&
                (shapeOrLayer && shapeOrLayer.is(CanvasShapes.SceneLayerInterface)) &&
                _.isArray(this.layers)
            ) {
                temp = _.find(this.layers, function (layerObj) {
                    return layerObj.layer === shapeOrLayer;
                });

            } else {
                throw new CanvasShapes.Error(1021);
            }

            if (temp) {
                return temp;
            }

            return null;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getSceneInterfaceHandlers: function () {

            if (!this.sceneInterfaceHandlers) {
                this.sceneInterfaceHandlers = {
                    newLayerHandler: _.bind(this.newLayer, this),
                    getLayerHandler: _.bind(this.getLayer, this),
                    addShapeHandler: _.bind(this.addShape, this),
                    on: _.bind(this.on, this),
                    off: _.bind(this.off, this),
                    dispatch: _.bind(this.dispatch, this)
                };
            }

            return this.sceneInterfaceHandlers;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getWidth: function () {
            return this.width;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getHeight: function () {
            return this.height;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getDom: function () {
            return this.dom;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        on: function (eventType, handler, context) {

            // remove existing handler
            this.off(handler, eventType);

            if (!_.isArray(this.handlers[eventType])) {
                this.handlers[eventType] = [];
            }

            this.handlers[eventType].push({
                handler: handler,
                context: _.isUndefined(context) ? this : context
            });

            return true;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        off: function (handlerOrType, eventType) {

            var i, j;

            for (i in this.handlers) {

                if (_.isString(handlerOrType) && i === handlerOrType) {
                    // removing all handlers of this type
                    this.handlers[i] = [];
                } else if (_.isFunction(handlerOrType)) {
                    for (j = 0; j < this.handlers[i].length; j++) {
                        if (this.handlers[i][j].handler === handlerOrType) {
                            if (
                                (_.isString(eventType) && i === eventType) ||
                                !_.isString(eventType)
                            ) {
                                this.handlers[i] = CanvasShapes.Tools.removeByIndex(this.handlers[i], j);
                            }
                        }
                    }
                }
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        dispatch: function (event) {

            var i, handlers, e, type;

            if (
                _.isObject(event) && _.isFunction(event.is) &&
                event.is(CanvasShapes.Event)
            ) {
                // already prepared event instance
                if (_.isArray(this.handlers[event.getType()])) {
                    handlers = this.handlers[event.getType()];
                }

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
                e = CanvasShapes.Event.getInstance(event, this.dom);
            }

            for (i = 0; i < handlers.length; i++) {
                handlers[i].handler.apply(handlers[i].context, [e]);
            }
        }
    });

    return SceneAbstract;
}());
