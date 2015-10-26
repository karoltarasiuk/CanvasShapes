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
        },

        /**
         * Adds a style object to specified shape(s).
         *
         * @param {[array,CanvasShapes.RenderingInterface]}   shapes
         * @param {boolean}                                   deep
         */
        addToShapes: function (shapes, deep) {
            throw new CanvasShapes.Error(9060);
        },

        /**
         * Animates chosen style definition on every associated shape. Style
         * must be added to shapes using `addToShapes()` method. Currently
         * supports only colour changes.
         *
         * `definitionObject` format:
         * ```
         * {
         *     //
         * }
         * ```
         *
         * `which` parameter must specify existing
         * base definition (or left empty to change a default one).
         *
         * @param  {function} callback
         * @param  {number}   totalAnimationTime
         * @param  {object}   definitionObject
         * @param  {string}   which [OPTIONAL]
         *
         * @return {CanvasShapes.AnimationInterface}
         */
        animate: function (
            totalAnimationTime,
            definitionObject,
            callback,
            which
        ) {
            throw new CanvasShapes.Error(9059);
        }
    });

    return StyleInterface;
}());
