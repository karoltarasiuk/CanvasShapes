/*global CanvasShapes*/

CanvasShapes.SceneLayerInterface = (function () {

    /**
     * Interface class for layer objects.
     *
     * @throws {CanvasShapes.Error} 8016
     */
    var SceneLayerInterface = function () {
        throw new CanvasShapes.Error(8016);
    };

    CanvasShapes.Class.extend(SceneLayerInterface.prototype, {

        _className: 'CanvasShapes.SceneLayerInterface',

        /**
         * Allows you to get a scene the layer belongs to.
         *
         * @throws {CanvasShapes.Error} 9025
         *
         * @return {CanvasShapes.SceneInterface}
         */
        getScene: function () {
            throw new CanvasShapes.Error(9025);
        },

        /**
         * Gets canvas element associated with this layer.
         *
         * @throws {CanvasShapes.Error} 9063
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
         * @throws {CanvasShapes.Error} 9026
         *
         * @return {CanvasRenderingContext2D}
         */
        getContext: function () {
            throw new CanvasShapes.Error(9026);
        },

        /**
         * Allows you to get width of the layer in px.
         *
         * @throws {CanvasShapes.Error} 9027
         *
         * @return {integer}
         */
        getWidth: function () {
            throw new CanvasShapes.Error(9027);
        },

        /**
         * Get top offset of the layer relatively to the scene.
         *
         * @throws {CanvasShapes.Error} 9064
         *
         * @return {integer}
         */
        getTop: function () {
            throw new CanvasShapes.Error(9064);
        },

        /**
         * Get left offset of the layer relatively to the scene.
         *
         * @throws {CanvasShapes.Error} 9065
         *
         * @return {integer}
         */
        getLeft: function () {
            throw new CanvasShapes.Error(9065);
        },

        /**
         * Allows you to get height of the layer in px.
         *
         * @throws {CanvasShapes.Error} 9028
         *
         * @return {integer}
         */
        getHeight: function () {
            throw new CanvasShapes.Error(9028);
        },

        /**
         * Clears this layer to it's original state.
         *
         * @throws {CanvasShapes.Error} 9069
         */
        clear: function () {
            throw new CanvasShapes.Error(9069);
        }
    });

    return SceneLayerInterface;
}());
