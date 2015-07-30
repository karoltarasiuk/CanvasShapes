/*global _, CanvasShapes, JSONChecker*/

CanvasShapes.SceneInterface = (function () {

    var SceneInterface = function () {
        throw new CanvasShapes.Error(8008);
    };

    CanvasShapes.Class.extend(SceneInterface.prototype, {

        className: 'CanvasShapes.SceneInterface',

        /**
         * Renders all the assinged layers and their shapes.
         */
        render: function () {
            throw new CanvasShapes.Error(9018);
        },

        /**
         * Creates new layer on the scene. `width`, `height`, `left` and `top`,
         * parameters will be passed to CanvasShapes.SceneLayer constructor.
         *
         * `shape` parameter if passed, allows you to add shape automatically
         * to the scene with associated newly created layer. You need to be
         * careful though, as the shape can be a child of a group, and adding
         * it as a standalone shape to the scene will cause it to render twice,
         * and in some cases can cause infinite loop which will raise an error.
         *
         * Best practice to obtain a separate layer for a shape being a child of
         * a group, is to call this method without passing a `shape` parameter,
         * which will create a layer and register it on a scene, but shape will
         * not be rendered as a standalone object.
         *
         * @param {CanvasShapes.ShapeInterface} shape [OPTIONAL]
         * @param {integer} width   [OPTIONAL]
         * @param {integer} height  [OPTIONAL]
         * @param {integer} left    [OPTIONAL]
         * @param {integer} top     [OPTIONAL]
         *
         * @return {CanvasShapes.SceneLayerInterface}
         */
        newLayer: function (shape, width, height, left, top) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * Allows you to retrieve a layer specific for a shape or layer.
         * If `shapeOrLayer` is null it will return default layer for a scene.
         * getLayer called without any arguments should ALWAYS return a
         * layer. By passing a layer you can establish whether the layer is
         * already a part of a scene - it will return `null` if it's not.
         *
         * @param {[
         *     CanvasShapes.ShapeInterface,
         *     CanvasShapes.SceneLayerInterface
         * ]} shapeOrLayer [OPTIONAL]
         * @return {CanvasShapes.SceneLayerInterface}
         */
        getLayer: function (shapeOrLayer) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * This method should only be used after the shape is already added
         * through CanvasShapes.Renderer instance. Adding shapes only to the
         * scene is not advised because it's not being registered in Renderer
         * and therefore cannot be controlled and rendered from there.
         *
         * Allows you to add a shape with its corresponding layer to the scene.
         * It's very useful when within one scene you want to have a different
         * configuration of layers than in a second scene of the same renderer.
         *
         * You need to be careful, as the shape can be a child of a group, and
         * adding it as a standalone shape to the scene will cause it to render
         * twice, and in some cases can cause infinite loop which will raise an
         * error.
         *
         * @param {CanvasShapes.SceneLayerInterface} layer
         * @param {CanvasShapes.ShapeInterface} shape [OPTIONAL]
         *
         * @return {CanvasShapes.SceneLayerInterface}
         */
        addShape: function (layer, shape) {
            throw new CanvasShapes.Error(9019);
        },

        /**
         * Gets handlers which can allow a shape to obtain some functionality
         * from a scene. Minimum set of handlers is: newLayerHandler,
         * getLayerHandler, addShapeHandler
         *
         * @return {object}
         */
        getSceneInterfaceHandlers: function () {
            throw new CanvasShapes.Error(9034);
        },

        /**
         * Returns width of the scene.
         *
         * @return {integer}
         */
        getWidth: function () {
            throw new CanvasShapes.Error(9020);
        },

        /**
         * Returns height of the scene.
         *
         * @return {integer}
         */
        getHeight: function () {
            throw new CanvasShapes.Error(9021);
        },

        /**
         * Returns HTML container for this scene.
         *
         * @return {object}
         */
        getDom: function () {
            throw new CanvasShapes.Error(9022);
        },

        /**
         * Allows you to specify whether this scene is rendered relatively, i.e.
         * whether it treats coordinates as pixels, or percents. It will return
         * `true` if the value was successfully set, or `false` otherwise.
         *
         * @param {boolean} relativeRendering
         * @return {boolean}
         */
        setRelativeRendering: function (relativeRendering) {
            throw new CanvasShapes.Error(9023);
        },

        /**
         * Returns current value for relative rendering feature.
         *
         * @return {boolean}
         */
        getRelativeRendering: function () {
            throw new CanvasShapes.Error(9024);
        }
    });

    return SceneInterface;
}());
