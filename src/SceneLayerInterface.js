/*global _, CanvasShapes*/

CanvasShapes.SceneLayerInterface = (function () {

    var SceneLayerInterface = function () {
        throw new CanvasShapes.Error(8016);
    };

    CanvasShapes.Class.extend(SceneLayerInterface.prototype, {

        className: 'CanvasShapes.SceneLayerInterface',

        /**
         * Allows you to get a scene the layer belongs to.
         *
         * @return {CanvasShapes.SceneInterface}
         */
        getScene: function () {
            throw new CanvasShapes.Error(9025);
        },

        /**
         * Gets canvas element associated with this layer.
         *
         * @return {HTMLCanvasElement}
         */
        getCanvas: function () {
            throw new CanvasShapes.Error(9063);
        },

        /**
         * Allows you to get 2D context of the canvas object contained in
         * this layer.
         *
         * @return {CanvasRenderingContext2D}
         */
        getContext: function () {
            throw new CanvasShapes.Error(9026);
        },

        /**
         * Allows you to get width of the layer in px.
         *
         * @return {integer}
         */
        getWidth: function () {
            throw new CanvasShapes.Error(9027);
        },

        /**
         * Get top offset of the layer relatively to the scene.
         *
         * @return {integer}
         */
        getTop: function () {
            throw new CanvasShapes.Error(9064);
        },

        /**
         * Get left offset of the layer relatively to the scene.
         *
         * @return {integer}
         */
        getLeft: function () {
            throw new CanvasShapes.Error(9064);
        },

        /**
         * Allows you to get height of the layer in px.
         *
         * @return {integer}
         */
        getHeight: function () {
            throw new CanvasShapes.Error(9028);
        },

        /**
         * Clears this layer to it's original state.
         */
        clear: function () {}
    });

    return SceneLayerInterface;
}());
