/*global _, CanvasShapes*/

CanvasShapes.StyleInterface = (function () {

    /**
     * Interface for styling objects.
     */
    var StyleInterface = function () {
        throw new CanvasShapes.Error(8014);
    };

    CanvasShapes.Class.extend(StyleInterface.prototype, {

        className: 'CanvasShapes.StyleInterface',

        /**
         * Sets the style on the given layer depending on `which` param.
         * If `which` param is not specified it will retrieve the first
         * available style.
         *
         * WARNING: this method due to performance reasons doesn't perform any
         * type checking on arguments.
         *
         * @param {CanvasShapes.SceneLayer} layer
         * @param {integer} which [OPTIONAL]
         */
        set: function (layer, which) {
            throw new CanvasShapes.Error(9006);
        }
    });

    return StyleInterface;
}());
