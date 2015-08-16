/*global _, CanvasShapes*/

CanvasShapes.Shape = (function () {

    var Shape = function () {};

    CanvasShapes.Class.extend(
        Shape.prototype,
        CanvasShapes.RenderingAbstract.prototype,
        CanvasShapes.ShapeAbstract.prototype,
        CanvasShapes.CoordinatesAbstract.prototype,
        CanvasShapes.InteractionAbstract.prototype,
    {
        className: 'CanvasShapes.Shape'
    });

    return Shape;
}());
