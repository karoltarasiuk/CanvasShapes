/*global _, CanvasShapes*/

CanvasShapes.AnimationInterface = (function () {

    /**
     * Interface for any object able to animate.
     */
    var AnimationInterface = function () {
        throw new CanvasShapes.Error(8021);
    };

    CanvasShapes.Class.extend(AnimationInterface.prototype, {

        className: 'CanvasShapes.AnimationInterface'
    });

    return AnimationInterface;
}());
