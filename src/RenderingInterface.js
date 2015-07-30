/*global _, CanvasShapes*/

CanvasShapes.RenderingInterface = (function () {

    var RenderingInterface = function () {
        throw new CanvasShapes.Error(8009);
    };

    CanvasShapes.Class.extend(RenderingInterface.prototype, {

        className: 'CanvasShapes.RenderingInterface',

        /**
         * Allows parent to run rendering of a shape on passed layer.
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
         * @param {object} sceneInterfaceHandlers
         */
        setSceneInterfaceHandlers: function (sceneInterfaceHandlers) {
            throw new CanvasShapes.Error(9003);
        },

        /**
         * Allows you to assign the style to a rendering shape. If `deep` is
         * `true`, the style will be applied to the children shapes as well.
         *
         * @param {CanvasShapes.StyleInterface} style
         * @param {boolean} deep
         */
        setStyle: function (style, deep) {
            throw new CanvasShapes.Error(9029);
        },

        /**
         * Returns currently assigned style object.
         *
         * @return {[null, CanvasShapes.StyleInterface]}
         */
        getStyle: function () {
            throw new CanvasShapes.Error(9030);
        },

        /**
         * Allows you to specify whether this rendering object is rendered
         * relatively, i.e. whether it treats coordinates as pixels, or percents.
         * It will return `true` if the value was successfully set, or `false`
         * otherwise.
         *
         * @param {boolean} relativeRendering
         * @return {boolean}
         */
        setRelativeRendering: function (relativeRendering) {
            throw new CanvasShapes.Error(9035);
        },

        /**
         * Returns current value for relative rendering of this rendering object.
         *
         * @return {boolean}
         */
        getRelativeRendering: function () {
            throw new CanvasShapes.Error(9036);
        }
    });

    return RenderingInterface;
}());
