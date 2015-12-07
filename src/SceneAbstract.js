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
         * @implements {CanvasShapes.SceneInterface}
         */
        initialiseListeners: function () {
            if (!this.dom || !this.dom.addEventListener) {
                throw new CanvasShapes.Error(1027);
            }

            this.handlers = {};
            this.ignoredEvents = {};
            CanvasShapes.Event.initialiseListeners(this);
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        shouldRenderOffScreen: function () {
            return this._shouldRenderOffScreen === true ? true : false;
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
                    top,
                    this.shouldRenderOffScreen()
                );

            if (shape && !shape.is(CanvasShapes.ShapeInterface)) {
                throw new CanvasShapes.Error(1019);
            }

            if (shape) {
                this.addShape(shape, layer);
            } else {
                this.initialiseLayers();
            }

            return layer;
        },

        /**
         * Initialise array of layers creating one default
         */
        initialiseLayers: function () {

            var layer;

            if (!_.isObject(this.layers)) {
                this.layers = {};
                layer = new CanvasShapes.SceneLayer(
                    this,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    this.shouldRenderOffScreen()
                );
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

            this.initialiseLayers();

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
        requestRendering: function (shape, animationFrame) {

            var i, j, layer, layerObject, requestedLayer, found, originalShape,
                uuid;

            if (!_.isObject(this.requestedRendering)) {
                this.requestedRendering = {};
            }

            // shape may be a part of a group
            originalShape = shape = shape.getRenderingShape();

            // looking for layer
            for (i in this.layers) {
                layerObject = this.layers[i];
                for (j in layerObject.shapes) {
                    if (shape === layerObject.shapes[j]) {
                        layer = layerObject.layer;
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }

            if (!layer) {
                // shape is not associated with any layer...
                throw new CanvasShapes.Error(1044);
            }

            // checking if shape changed the layer
            for (i in this.requestedRendering) {
                for (j in this.requestedRendering[i].shapes) {
                    // found a shape
                    if (j === shape.getUUID()) {
                        // checking if layers are the same
                        if (i === layer.getUUID()) {
                            // adding new animation frame
                            this.requestedRendering[i].shapes[j]
                                .animationFrames[animationFrame.getType()] =
                                    animationFrame;
                            return;
                        } else {
                            // we remove the shape as layer has changed, and
                            // shape must be added to a new one
                            delete this.requestedRendering[i].shapes[j];
                        }
                    }
                }
            }

            // in case of this is a new shape, we fetch the layer object
            // or create a new one
            if (!this.requestedRendering[layer.getUUID()]) {

                this.requestedRendering[layer.getUUID()] = {
                    layer: layer,
                    shapes: {}
                };
                requestedLayer = this.requestedRendering[layer.getUUID()];

                // we should add all the shapes as this layer will be cleared
                for (j in layerObject.shapes) {
                    shape = layerObject.shapes[j];
                    uuid = shape.getUUID();

                    if (!requestedLayer.shapes[uuid]) {
                        // this shape was not added previously
                        requestedLayer.shapes[uuid] = {
                            animationFrames: {}
                        };
                    }

                    requestedLayer.shapes[uuid].shape = shape;

                    if (originalShape === shape && animationFrame) {
                        requestedLayer.shapes[uuid]
                            .animationFrames[animationFrame.getType()] =
                                animationFrame;
                    }
                }

            } else {
                requestedLayer = this.requestedRendering[layer.getUUID()];
                uuid = shape.getUUID();

                if (!requestedLayer.shapes[uuid]) {
                    // this shape was not added previously
                    requestedLayer.shapes[uuid] = {
                        animationFrames: {}
                    };
                }

                requestedLayer.shapes[uuid].shape = shape;

                if (animationFrame) {
                    requestedLayer.shapes[uuid]
                        .animationFrames[animationFrame.getType()] =
                            animationFrame;
                }
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

            this.initialiseLayers();

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
                    newLayer: _.bind(this.newLayer, this),
                    getLayer: _.bind(this.getLayer, this),
                    addShape: _.bind(this.addShape, this),
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
