/*global _, CanvasShapes*/

CanvasShapes.ShapeInterface = (function () {

    var ShapeInterface = function () {
        throw new CanvasShapes.Error(8015);
    };

    CanvasShapes.Class.extend(ShapeInterface.prototype, {

        className: 'CanvasShapes.ShapeInterface'
    });

    return ShapeInterface;
}());
