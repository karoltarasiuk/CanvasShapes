/*global _, CanvasShapes*/

CanvasShapes.Style = (function () {

    /**
     * Styling object.
     */
    var Style = function (definition) {

        if (!definition) {
            definition = function () {};
        }

        this.initialise(definition);
    };

    CanvasShapes.Class.extend(
        Style.prototype,
        CanvasShapes.StyleAbstract.prototype,
    {
        className: 'CanvasShapes.Style'
    });

    return Style;
}());
