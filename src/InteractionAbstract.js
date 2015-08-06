/*global _, CanvasShapes*/

CanvasShapes.InteractionAbstract = (function () {

    var InteractionAbstract = function () {
        throw new CanvasShapes.Error(8018);
    };

    CanvasShapes.Class.extend(InteractionAbstract.prototype, {

        className: 'CanvasShapes.InteractionAbstract',
    });

    return InteractionAbstract;
}());
