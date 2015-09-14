/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneAbstract = (function () {

    var SceneAbstract = function () {
        throw new CanvasShapes.Error(8007);
    };

    CanvasShapes.Class.extend(
        SceneAbstract.prototype,
        CanvasShapes.SceneInterface.prototype,
    {
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
         *     UUID: {
         *         layer: CanvasShapes.SceneLayerInterface
         *         shapes: {
         *             UUID: CanvasShapes.ShapeInterface
         *         }
         *     },
         *     ...
         * }
         *
         * @type {array}
         */
        layers: null,

        /**
         * All the attached event handlers divided by event type in the
         * following format:
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
         * List of events currently ignored by the given objects in the
         * following format:
         *
         * {
         *     click: [
         *         object1,
         *         object2,
         *         ...
         *     ],
         *     ...
         * }
         *
         * @type {object}
         */
        ignoredEvents: null,

        /**
         * Array of shapes which needs to be rendered when the next animation
         * frame is requested in the following format:
         *
         * {
         *     UUID: {
         *         layer: layer,
         *         shapes: {
         *             UUID: {
         *                 shape: shape,
         *                 callback: callback,
         *                 context: context
         *             },
         *             ...
         *         }
         *     },
         *     ...
         * }
         *
         * @type {array}
         */
        requestedRendering: null,

        /**
         * Initializes event listeners. Call ONLY when `this.dom` is ready!
         */
        initializeListeners: function () {
            if (!this.dom || !this.dom.addEventListener) {
                throw new CanvasShapes.Error(1027);
            }

            this.handlers = {};
            this.ignoredEvents = {};
            CanvasShapes.Event.initializeListeners(this);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        newLayer: function (shape, width, height, left, top) {

            var layerObject,
                layer = new CanvasShapes.SceneLayer(
                    this,
                    width,
                    height,
                    left,
                    top
                );

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

            var layer;

            if (!_.isObject(this.layers)) {
                this.layers = {};
                layer = new CanvasShapes.SceneLayer(this);
                this.layers[layer.getUUID()] = {
                    layer: layer,
                    shapes: {}
                };
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

            if (shape && shape.is && shape.is(CanvasShapes.ShapeInterface)) {
                // retrieving current layer object for this shape
                layerObject = this.getLayerObject(shape);
                if (layerObject) {
                    if (layer) {
                        if (layer !== layerObject.layer) {
                            // removing shape from this layer object
                            delete layerObject.shapes[shape.getUUID()];
                            // we need to add shape to a new layer object
                            if (!this.layers[layer.getUUID()]) {
                                this.layers[layer.getUUID()] = {
                                    layer: layer,
                                    shapes: {}
                                };
                            }

                            this.layers[layer.getUUID()]
                                .shapes[shape.getUUID()] = shape;
                        }
                    } else {
                        // we leave the shape as it is
                        layer = layerObject.layer;
                    }
                } else {
                    // shape wasn't added yet
                    if (!layer) {
                        layer = this.getLayer();
                    }

                    if (!this.layers[layer.getUUID()]) {
                        this.layers[layer.getUUID()] = {
                            layer: layer,
                            shapes: {}
                        };
                    }

                    this.layers[layer.getUUID()]
                        .shapes[shape.getUUID()] = shape;
                }
            } else {
                throw new CanvasShapes.Error(1020);
            }

            shape.setSceneInterfaceHandlers(this.getSceneInterfaceHandlers());
            this.requestRendering(shape);

            return layer;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        requestRendering: function (shape, callback, context) {

            var i, j, layer, layerObject, requestedLayer;

            if (!_.isObject(this.requestedRendering)) {
                this.requestedRendering = {};
            }

            // looking for layer
            for (i in this.layers) {
                layerObject = this.layers[i];
                for (j in layerObject.shapes) {
                    if (shape === layerObject.shapes[j]) {
                        layer = layerObject.layer;
                    }
                }
            }

            if (layer) {
                if (this.requestedRendering[layer.getUUID()]) {
                    // the layer shape is already in `this.requestedRendering`
                    requestedLayer = this.requestedRendering[layer.getUUID()];
                } else {
                    // layer is passed but is not in the structure
                    this.requestedRendering[layer.getUUID()] = {
                        layer: layer,
                        shapes: {}
                    };
                    requestedLayer = this.requestedRendering[layer.getUUID()];
                }

                if (!requestedLayer.shapes[shape.getUUID()]) {
                    // this shape was not added previously
                    requestedLayer.shapes[shape.getUUID()] = {};
                }

                // the shape is already in `this.requestedRendering`
                requestedLayer.shapes[shape.getUUID()].shape = shape;
                requestedLayer.shapes[shape.getUUID()].callback = callback;
                requestedLayer.shapes[shape.getUUID()].context = context;
            } else {
                // shape is not associated with any layer...
                throw new CanvasShapes.Error(1044);
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getLayer: function (shape) {

            var layerObject = this.getLayerObject(shape);

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
         * @param {[CanvasShapes.ShapeInterface]} shape [OPTIONAL]
         * @return {[null,object]} format:
         * {
         *     layer: CanvasShapes.SceneLayerInterface
         *     shapes: {
         *         UUID: CanvasShapes.ShapeInterface
         *     }
         * }
         */
        getLayerObject: function (shape) {

            var i, j, count, tempCount, layerObject;

            this.initializeLayers();

            // looking for layer with the least number of shapes
            if (shape === undefined) {

                tempCount = -1;

                for (i in this.layers) {
                    count = 0;
                    for (j in this.layers[i].shapes) {
                        count++;
                    }
                    if (count > tempCount) {
                        layerObject = this.layers[i];
                    }
                }

            // finding by shape
            } else if (
                _.isObject(shape) && shape.is &&
                shape.is(CanvasShapes.ShapeInterface)
            ) {
                for (i in this.layers) {
                    if (this.layers[i].shapes[shape.getUUID()]) {
                        layerObject = this.layers[i];
                    }
                }
            } else {
                throw new CanvasShapes.Error(1021);
            }

            if (layerObject) {
                return layerObject;
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
                    requestRendering: _.bind(this.requestRendering, this),
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
        }
    });

    return SceneAbstract;
}());
