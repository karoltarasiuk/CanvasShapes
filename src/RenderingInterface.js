/*global CanvasShapes*/

CanvasShapes.RenderingInterface = (function () {

    /**
     * An interface for all able to be renderered objects.
     *
     * @throws {CanvasShapes.Error} 8009
     */
    var RenderingInterface = function () {
        throw new CanvasShapes.Error(8009);
    };

    CanvasShapes.Class.extend(RenderingInterface.prototype, {

        _className: 'CanvasShapes.RenderingInterface',

        /**
         * Allows parent to run rendering of a shape on passed layer.
         *
         * @throws {CanvasShapes.Error} 9001
         *
         * @param {CanvasShapes.SceneLayerInterface} layer
         */
        render: function (layer) {
            throw new CanvasShapes.Error(9001);
        },

        /**
         * Sets handlers which can allow a shape to obtain some functionality
         * from a scene.
         *
         * Note that since a shape can be put on multiple scenes, this method
         * must take care of multiple scenes calling this method. All handlers
         * should be saved and used when needed.
         *
         * @throws {CanvasShapes.Error} 9003
         *
         * @param {object} sceneInterfaceHandlers
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            throw new CanvasShapes.Error(9003);
        },

        /**
         * Gets handlers associated with this rendering object (context is set),
         * which allows to execute some functionality on a scene.
         *
         * This method should return an array with all available scene methods:
         * - newLayer
         * - getLayer
         * - addShape
         * - requestRendering
         * - on
         * - off
         * - dispatch
         *
         * Since one rendering object (or shape) can belong to many scenes,
         * returned methods must actually be wrappers, and run the same methods
         * on each scene.
         *
         * @return {[array]}
         */
        getSceneInterfaceHandlers: function () {
            throw new CanvasShapes.Error(9073);
        },

        /**
         * Allows you to assign the style to a rendering shape. If `deep` is
         * `true`, the style will be applied to the children shapes as well.
         *
         * [WARNING] This method shouldn't be used separately unless you know
         * exactly what you are doing. To add a style to a shape please use
         * `addToShape` from `CanvasShapes.StyleInterface`.
         *
         * @throws {CanvasShapes.Error} 9029
         *
         * @param {CanvasShapes.StyleInterface} style
         * @param {boolean}                     deep
         */
        setStyle: function (style, deep) {
            throw new CanvasShapes.Error(9029);
        },

        /**
         * Returns currently assigned style object.
         *
         * @throws {CanvasShapes.Error} 9030
         *
         * @return {[null, CanvasShapes.StyleInterface]}
         */
        getStyle: function () {
            throw new CanvasShapes.Error(9030);
        },

        /**
         * Allows you to specify whether this rendering object is rendered
         * relatively, i.e. whether it treats coordinates as pixels, or
         * percents. It will return `true` if the value was successfully set, or
         * `false` otherwise.
         *
         * @throws {CanvasShapes.Error} 9035
         *
         * @param {boolean} relativeRendering
         * @return {boolean}
         */
        setRelativeRendering: function (relativeRendering) {
            throw new CanvasShapes.Error(9035);
        },

        /**
         * Returns current value for relative rendering of this rendering
         * object.
         *
         * @throws {CanvasShapes.Error} 9036
         *
         * @return {boolean}
         */
        getRelativeRendering: function () {
            throw new CanvasShapes.Error(9036);
        }
    });

    return RenderingInterface;
}());
