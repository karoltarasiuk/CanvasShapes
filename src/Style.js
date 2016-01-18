/*global CanvasShapes*/

CanvasShapes.Style = (function () {

    /**
     * Initialises the style with default definition.
     *
     * The `definition` is a function accepting a `context` of a layer, e.g:
     * ```
     * function (context) {
     *     context.stroke();
     * }
     * ```
     * or it's an object with definition properties, e.g.:
     * ```
     * {
     *     strokeStyle: 'black',
     *     fillStyle: 'white'
     * }
     * ```
     *
     * [WARNING] Definition object is not as flexible, but colors specified
     * there can be animated.
     *
     * @param {[function, object]} definition
     */
    var Style = function (definition) {

        if (!definition) {
            definition = function () {};
        }

        this._initialise(definition);
    };

    CanvasShapes.Class.extend(
        Style.prototype,
        CanvasShapes.StyleAbstract.prototype,
    {
        _className: 'CanvasShapes.Style'
    });

    return Style;
}());
