/*global _, CanvasShapes*/

CanvasShapes.ShapeAbstract = (function () {

    var ShapeAbstract = function () {
        throw new CanvasShapes.Error(8003);
    };

    CanvasShapes.Class.extend(ShapeAbstract.prototype, CanvasShapes.ShapeInterface.prototype, {

        className: 'CanvasShapes.ShapeAbstract'
    });

    return ShapeAbstract;
}());
