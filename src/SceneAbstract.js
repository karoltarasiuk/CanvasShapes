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
            }

            return layer;
        },

        /**
         * Initialise array of layers creating one default
         */
        initialiseLayers: function () {

            var layer;

            if (!_.isObject(this.layers)) {
                this.layers = [];
                layer = new CanvasShapes.SceneLayer(
                    this,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    this.shouldRenderOffScreen()
                );
                this.layers.push({
                    layer: layer.getUUID(),
                    shapes: []
                });
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        addShape: function (shape, layer) {

            var i, layerObject;

            // checking whether passed layer is OK
            if (
                layer && !CanvasShapes.Class.isUUID(layer) &&
                (!_.isObject(layer) || _.isFunction(layer.is) ||
                !layer.is(CanvasShapes.SceneLayerInterface))
            ) {
                throw new CanvasShapes.Error(1022);
            }

            if (_.isObject(layer)) {
                layer = layer.getUUID();
            }

            // checking whether passed shape is OK
            if (
                CanvasShapes.Class.isUUID(shape) &&
                (_.isObject(shape) || _.isFunction(shape.is) ||
                shape.is(CanvasShapes.ShapeInterface))
            ) {
                throw new CanvasShapes.Error(1020);
            }

            if (_.isObject(shape)) {
                shape = shape.getUUID();
            }

            // retrieving current layer object for this shape
            layerObject = this.getLayerObject(shape);

            if (layerObject) {

                if (!layer) {
                    // layer was not passed, so all stay as it was
                    layer = layerObject.layer;

                } else if (layer !== layerObject.layer) {

                    // removing shape from this layer object
                    for (i = 0; i < layerObject.shapes.length; i++) {
                        if (layerObject.shapes[i] === shape) {
                            CanvasShapes.Tools.removeByIndex(
                                layerObject.shapes, i
                            );
                            break;
                        }
                    }

                    // fetching layer object by new layer and adding the shape
                    layerObject = this.getLayerObjectByLayer(layer, true);
                    layerObject.shapes.push(shape);
                }
            } else {
                // shape wasn't added yet, fetching correct layer
                if (!layer) {
                    layerObject = this.getLayerObject();
                } else {
                    layerObject = this.getLayerObjectByLayer(layer);
                }

                layerObject.shapes.push(shape);
            }

            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            // this is TRICKY!!!
            shape.setSceneInterfaceHandlers(this.getSceneInterfaceHandlers());
            this.requestRendering(shape);

            return layer;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        requestRendering: function (shape, animationFrame) {

            var i, j, layer, layerObject, requestedLayerObject, temp;

            if (!_.isArray(this.requestedRendering)) {
                this.requestedRendering = [];
            }

            layerObject = this.getLayerObject(shape);

            if (!layerObject) {
                // shape is not associated with any layer
                throw new CanvasShapes.Error(1044);
            }

            layer = layerObject.layer;

            if (
                animationFrame && (!_.isObject(animationFrame) ||
                !_.isFunction(animationFrame.is) ||
                !animationFrame.is(CanvasShapes.AnimationFrameInterface))
            ) {
                throw new CanvasShapes.Error(1073);
            }

            // checking if shape changed the layer
            for (i = 0; i < this.requestedRendering.length; i++) {
                for (j = 0; j < this.requestedRendering[i].shapes.length; j++) {
                    // found a shape
                    if (this.requestedRendering[i].shapes[j].shape === shape) {
                        // checking if layers are the same
                        if (this.requestedRendering[i].layer === layer) {
                            // adding new animation frame if it was passed
                            if (animationFrame) {
                                this.requestedRendering[i].shapes[j]
                                    .animationFrames[animationFrame.getType()] =
                                        animationFrame;
                            }
                            return;
                        } else {
                            // we remove the shape as layer has changed, and
                            // shape must be added to a new one
                            CanvasShapes.Tools.removeByIndex(
                                this.requestedRendering[i].shapes, j
                            );
                        }
                    }
                }
            }

            // in case of this is a new shape, or shaped changed its layer, we
            // need to fetch the requested rendering object ...
            for (i = 0; i < this.requestedRendering.length; i++) {
                if (this.requestedRendering[i].layer === layer) {
                    requestedLayerObject = this.requestedRendering[i];
                }
            }

            // ... or create a new one, if it's not there yet
            if (!requestedLayerObject) {
                requestedLayerObject = {
                    layer: layer,
                    shapes: []
                };
                this.requestedRendering.push(requestedLayerObject);
            }

            // and finally we add a shape to the structure
            temp = {
                shape: shape,
                animationFrames: {}
            };

            if (animationFrame) {
                temp.animationFrames[animationFrame.getType()] = animationFrame;
            }

            requestedLayerObject.shapes.push(temp);
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
         * Format of returned object:
         * ```
         * {
         *     layer: UUID
         *     shapes: [
         *         UUID,
         *         UUID,
         *         ...
         *     ]
         * }
         * ```
         *
         * @param {[CanvasShapes.ShapeInterface]} shape [OPTIONAL]
         * @return {[null,object]}
         */
        getLayerObject: function (shape) {

            var i, j, count, tempCount,
                layerObject = null;

            // looking for layer with the least number of shapes
            if (shape === undefined) {

                for (i = 0; i < this.layers.length; i++) {
                    count = this.layers[i].shapes.length;
                    if (tempCount === undefined || count < tempCount) {
                        tempCount = count;
                        layerObject = this.layers[i];
                    }
                }

            // finding by shape
            } else if (
                CanvasShapes.Class.isUUID(shape) ||
                (_.isObject(shape) && shape.is &&
                shape.is(CanvasShapes.ShapeInterface))
            ) {
                if (_.isObject(shape)) {
                    shape = shape.getUUID();
                }

                for (i in this.layers) {
                    if (
                        _.indexOf(this.layers[i].shapes, shape) !== -1
                    ) {
                        layerObject = this.layers[i];
                    }
                }

            } else {
                throw new CanvasShapes.Error(1021);
            }

            return layerObject;
        },

        /**
         * Allows you to retrieve a layer object specific to the passed layer.
         * If `add` is passed as `true` it will create a new layer object for
         * this layer associating it with this scene.
         *
         * @param  {[string,CanvasShapes.SceneLayerInterface]} layer
         * @param  {boolean}                                   add
         *
         * @return {object}
         */
        getLayerObjectByLayer: function (layer, add) {

            var i;

            // checking whether passed layer is OK
            if (
                layer && !CanvasShapes.Class.isUUID(layer) &&
                (!_.isObject(layer) || _.isFunction(layer.is) ||
                !layer.is(CanvasShapes.SceneLayerInterface))
            ) {
                throw new CanvasShapes.Error(1072);
            }

            if (_.isObject(layer)) {
                layer = layer.getUUID();
            }

            for (i = 0; i < this.layers.length; i++) {
                if (this.layers[i].layer === layer) {
                    return this.layers[i];
                }
            }

            if (add === true) {
                this.layers.push({
                    layer: layer,
                    shapes: []
                });
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
