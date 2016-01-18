/*global CanvasShapes*/

CanvasShapes.AnimationFrameInterface = (function () {

    /**
     * Abstract implementation of animation helper.
     *
     * @throws {CanvasShapes.Error} 8023
     */
    var AnimationFrameInterface = function () {
        throw new CanvasShapes.Error(8023);
    };

    CanvasShapes.Class.extend(AnimationFrameInterface.prototype, {

        _className: 'CanvasShapes.AnimationFrameInterface',

        /**
         * Executes preparation for rendering next frame. It must also call
         * `requestRendering` on scene interface to schedule rendering.
         *
         * @throws {CanvasShapes.Error} 9052
         */
        next: function () {
            throw new CanvasShapes.Error(9052);
        },

        /**
         * Resets animation frame instance the state as nothing happened, and
         * animation didn't even start.
         *
         * @throws {CanvasShapes.Error} 9053
         */
        reset: function () {
            throw new CanvasShapes.Error(9053);
        },

        /**
         * Normally you can't apply more than one animation to a shape at a
         * time. And this is still true for CanvasShapes, but only within the
         * same time. If the type of your animation object will be different
         * than already existing one, it will be animated as well.
         *
         * @throws {CanvasShapes.Error} 9061
         *
         * @return {string}
         */
        getType: function () {
            throw new CanvasShapes.Error(9061);
        }
    });

    return AnimationFrameInterface;
}());
