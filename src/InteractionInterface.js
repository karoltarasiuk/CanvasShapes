/*global _, CanvasShapes*/

CanvasShapes.InteractionInterface = (function () {

    /**
     * An interface for any shape providing interaction options, i.e. reacting
     * on mouse and keyboard input.
     */
    var InteractionInterface = function () {
        throw new CanvasShapes.Error(8010);
    };

    CanvasShapes.Class.extend(InteractionInterface.prototype, {

        className: 'CanvasShapes.InteractionInterface',
    });

    return InteractionInterface;
}());
