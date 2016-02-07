/*global CanvasShapes*/

CanvasShapes.Shape = (function () {

    /**
     * Another abstract base class for a shape. All dedicated shapes should
     * inherit from this class.
     *
     * @throws {CanvasShapes.Error} 8025
     */
    var Shape = function () {
        throw new CanvasShapes.Error(8025);
    };

    CanvasShapes.Class.extend(
        Shape.prototype,
        CanvasShapes.RenderingAbstract.prototype,
        CanvasShapes.CoordinatesAbstract.prototype,
        CanvasShapes.InteractionAbstract.prototype,
        CanvasShapes.AnimationAbstract.prototype,
        CanvasShapes.CacheAbstract.prototype,
        CanvasShapes.ShapeAbstract.prototype,
    {
        _className: 'CanvasShapes.Shape'
    });

    return Shape;
}());
