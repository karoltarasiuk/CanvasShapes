/*global _, CanvasShapes*/

CanvasShapes.AnimationAbstract = (function () {

    /**
     * Abstract implementation for any object able to animate.
     */
    var AnimationAbstract = function () {
        throw new CanvasShapes.Error(8022);
    };

    CanvasShapes.Class.extend(AnimationAbstract.prototype, CanvasShapes.AnimationInterface.prototype, {

        className: 'CanvasShapes.AnimationAbstract'
    });

    return AnimationAbstract;
}());
