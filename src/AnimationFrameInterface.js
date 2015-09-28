/*global _, CanvasShapes*/

CanvasShapes.AnimationFrameInterface = (function () {

    /**
     * Abstract implementation of animation helper
     */
    var AnimationFrameInterface = function () {
        throw new CanvasShapes.Error(8023);
    };

    CanvasShapes.Class.extend(AnimationFrameInterface.prototype, {

        className: 'CanvasShapes.AnimationFrameInterface',

        next: function () {
            throw new CanvasShapes.Error(9052);
        },

        reset: function () {
            throw new CanvasShapes.Error(9053);
        }
    });

    return AnimationFrameInterface;
}());
