/*global CanvasShapes*/

CanvasShapes.StyleInterface = (function () {

    /**
     * Interface for styling objects.
     *
     * @throws {CanvasShapes.Error} 8014
     */
    var StyleInterface = function () {
        throw new CanvasShapes.Error(8014);
    };

    CanvasShapes.Class.extend(StyleInterface.prototype, {

        _className: 'CanvasShapes.StyleInterface',

        /**
         * Sets the style on the given layer depending on `which` param.
         * If `which` param is not specified it will retrieve the first
         * available style. `relativeRendering` param allows you to decide
         * whether e.g. line-width or other size-based params should be treated
         * as a percentage of layer's dimensions. Most of this parameters are
         * calculated based on layer's width unless it's explicit that height
         * should be used.
         *
         * WARNING: this method due to performance reasons doesn't perform any
         * type checking on arguments.
         *
         * @throws {CanvasShapes.Error} 9006
         *
         * @param {CanvasShapes.SceneLayer} layer
         * @param {boolean}                 relativeRendering
         * @param {integer}                 which [OPTIONAL]
         */
        set: function (layer, relativeRendering, which) {
            throw new CanvasShapes.Error(9006);
        },

        /**
         * Adds a style object to specified shape(s).
         *
         * @throws {CanvasShapes.Error} 9060
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
         * @throws {CanvasShapes.Error} 9059
         *
         * @param {function} callback
         * @param {integer}  totalAnimationTime
         * @param {object}   definitionObject
         * @param {string}   which [OPTIONAL]
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
