/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var Shape = function () {};

    CanvasShapes.Class.extend(
        Shape.prototype,
        CanvasShapes.Rendering.prototype,
        CanvasShapes.ShapeAbstract.prototype,
        CanvasShapes.CoordinatesAbstract.prototype,
        CanvasShapes.InteractionInterface.prototype,
    {
        className: 'CanvasShapes.Shape'
    });

    return Shape;
}());
