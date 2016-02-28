/*global CanvasShapes*/

CanvasShapes.SceneAbstract = (function () {

    /**
     * A scene abstract class.
     *
     * @throws {CanvasShapes.Error} 8007
     */
    var SceneAbstract = function () {
        throw new CanvasShapes.Error(8007);
    };

    CanvasShapes.Class.extend(
        SceneAbstract.prototype,
        CanvasShapes.SceneInterface.prototype,
    {
        _className: 'CanvasShapes.SceneAbstract',

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
        _layers: null,

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
        _handlers: null,

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
        _ignoredEvents: null,

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
        _requestedRendering: null,

        /**
         * Call ONLY when `this._dom` is ready!
         *
         * @implements {CanvasShapes.SceneInterface}
         *
         * @throws {CanvasShapes.Error} 1027
         */
        initialiseListeners: function () {
            if (!this._dom || !this._dom.addEventListener) {
                throw new CanvasShapes.Error(1027);
            }

            this._handlers = {};
            this._ignoredEvents = {};
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
         *
         * @throws {CanvasShapes.Error} 1019
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

            if (!CanvasShapes._.isObject(this._layers)) {
                this._layers = {};
                layer = new CanvasShapes.SceneLayer(
                    this,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    this.shouldRenderOffScreen()
                );
                this._layers[layer.getUUID()] = {
                    layer: layer,
                    shapes: {}
                };
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         *
         * @throws {CanvasShapes.Error} 1022
         * @throws {CanvasShapes.Error} 1020
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
                            if (!this._layers[layer.getUUID()]) {
                                this._layers[layer.getUUID()] = {
                                    layer: layer,
                                    shapes: {}
                                };
                            }

                            this._layers[layer.getUUID()]
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

                    if (!this._layers[layer.getUUID()]) {
                        this._layers[layer.getUUID()] = {
                            layer: layer,
                            shapes: {}
                        };
                    }

                    this._layers[layer.getUUID()]
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
         *
         * @throws {CanvasShapes.Error} 1044
         */
        requestRendering: function (shape, animationFrame, beforeRender) {

            var i, j, layer, layerObject, requestedLayer, found, originalShape,
                uuid;

            if (!CanvasShapes._.isObject(this._requestedRendering)) {
                this._requestedRendering = {};
            }

            // shape may be a part of a group
            originalShape = shape = shape.getRenderingShape();

            // looking for layer
            for (i in this._layers) {
                layerObject = this._layers[i];
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
            for (i in this._requestedRendering) {
                for (j in this._requestedRendering[i].shapes) {
                    // found a shape
                    if (j === shape.getUUID()) {
                        // checking if layers are the same
                        if (i === layer.getUUID()) {
                            // adding new only if animationFrame was passed
                            if (
                                CanvasShapes._.isFunction(animationFrame)
                            ) {
                                this._requestedRendering[i].shapes[j]
                                    .callbacks.push(animationFrame);
                            } else if (CanvasShapes._.isObject(animationFrame)) {
                                this._requestedRendering[i].shapes[j]
                                    .animationFrames[animationFrame.getType()] =
                                        animationFrame;
                            }
                            // adding beforeRender hook if was passed
                            if (beforeRender) {
                                this._requestedRendering[i].shapes[j]
                                    .beforeRender = beforeRender;
                            }
                            return;
                        } else {
                            // we remove the shape as layer has changed, and
                            // shape must be added to a new one
                            delete this._requestedRendering[i].shapes[j];
                        }
                    }
                }
            }

            // in case of this is a new shape, on a new layer we create a new
            // layer object
            if (!this._requestedRendering[layer.getUUID()]) {

                this._requestedRendering[layer.getUUID()] = {
                    layer: layer,
                    shapes: {}
                };
                requestedLayer = this._requestedRendering[layer.getUUID()];

                // we should add all the shapes as this layer will be cleared
                for (j in layerObject.shapes) {
                    shape = layerObject.shapes[j];
                    uuid = shape.getUUID();

                    if (!requestedLayer.shapes[uuid]) {
                        // this shape was not added previously
                        requestedLayer.shapes[uuid] = {
                            animationFrames: {},
                            callbacks: []
                        };
                    }

                    requestedLayer.shapes[uuid].shape = shape;

                    if (originalShape === shape) {
                        // adding animationFrame only if was passed
                        if (
                            CanvasShapes._.isFunction(animationFrame)
                        ) {
                            requestedLayer.shapes[uuid]
                                .callbacks.push(animationFrame);
                        } else if (CanvasShapes._.isObject(animationFrame)) {
                            requestedLayer.shapes[uuid]
                                .animationFrames[animationFrame.getType()] =
                                    animationFrame;
                        }
                        // adding beforeRender hook if was passed
                        if (beforeRender) {
                            requestedLayer.shapes[uuid]
                                .beforeRender = beforeRender;
                        }
                    }
                }
            // it's a new shape on already existing layer object
            } else {
                requestedLayer = this._requestedRendering[layer.getUUID()];
                uuid = shape.getUUID();

                if (!requestedLayer.shapes[uuid]) {
                    // this shape was not added previously
                    requestedLayer.shapes[uuid] = {
                        animationFrames: {},
                        callbacks: []
                    };
                }

                requestedLayer.shapes[uuid].shape = shape;
                // adding animationFrame only if was passed
                if (CanvasShapes._.isFunction(animationFrame)) {
                    requestedLayer.shapes[uuid]
                        .callbacks.push(animationFrame);
                } else if (CanvasShapes._.isObject(animationFrame)) {
                    requestedLayer.shapes[uuid]
                        .animationFrames[animationFrame.getType()] =
                            animationFrame;
                }
                // adding beforeRender hook if was passed
                if (beforeRender) {
                    this._requestedRendering[i].shapes[j]
                        .beforeRender = beforeRender;
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
         * Format or returned object:
         * ```
         * {
         *     layer: CanvasShapes.SceneLayerInterface
         *     shapes: {
         *         UUID: CanvasShapes.ShapeInterface
         *     }
         * }
         * ```
         *
         * @throws {CanvasShapes.Error} 1021
         *
         * @param {[CanvasShapes.ShapeInterface]} shape [OPTIONAL]
         * @return {[null,object]}
         */
        getLayerObject: function (shape) {

            var i, j, count, tempCount, layerObject;

            this.initialiseLayers();

            // looking for layer with the least number of shapes
            if (shape === undefined) {

                tempCount = -1;

                for (i in this._layers) {
                    count = 0;
                    for (j in this._layers[i].shapes) {
                        count++;
                    }
                    if (count > tempCount) {
                        layerObject = this._layers[i];
                    }
                }

            // finding by shape
            } else if (
                CanvasShapes._.isObject(shape) && shape.is &&
                shape.is(CanvasShapes.ShapeInterface)
            ) {
                for (i in this._layers) {
                    if (this._layers[i].shapes[shape.getUUID()]) {
                        layerObject = this._layers[i];
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

            if (!this._sceneInterfaceHandlers) {
                this._sceneInterfaceHandlers = {
                    newLayer: CanvasShapes._.bind(this.newLayer, this),
                    getLayer: CanvasShapes._.bind(this.getLayer, this),
                    addShape: CanvasShapes._.bind(this.addShape, this),
                    requestRendering: CanvasShapes._
                        .bind(this.requestRendering, this),
                    on: CanvasShapes._.bind(this.on, this),
                    off: CanvasShapes._.bind(this.off, this),
                    dispatch: CanvasShapes._.bind(this.dispatch, this)
                };
            }

            return this._sceneInterfaceHandlers;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getWidth: function () {
            return this._width;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getHeight: function () {
            return this._height;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getDom: function () {
            return this._dom;
        }
    });

    return SceneAbstract;
}());
