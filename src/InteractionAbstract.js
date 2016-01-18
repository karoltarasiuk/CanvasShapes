/*global CanvasShapes*/

CanvasShapes.InteractionAbstract = (function () {

    /**
     * An abstract class for shapes which can be interacted with.
     *
     * @throws {CanvasShapes.Error} 8018
     */
    var InteractionAbstract = function () {
        throw new CanvasShapes.Error(8018);
    };

    CanvasShapes.Class.extend(
        InteractionAbstract.prototype,
        CanvasShapes.InteractionInterface.prototype,
    {
        _className: 'CanvasShapes.InteractionAbstract'
    });

    return InteractionAbstract;
}());
