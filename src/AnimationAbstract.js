/*global CanvasShapes*/

CanvasShapes.AnimationAbstract = (function () {

    /**
     * Abstract implementation for any object able to animate.
     */
    var AnimationAbstract = function () {
        throw new CanvasShapes.Error(8022);
    };

    CanvasShapes.Class.extend(
        AnimationAbstract.prototype,
        CanvasShapes.AnimationInterface.prototype,
    {
        className: 'CanvasShapes.AnimationAbstract',

        /**
         * @implements {CanvasShapes.AnimationInterface}
         */
        animate: function (animationFrame) {

            if (
                !CanvasShapes._.isObject(animationFrame) ||
                !CanvasShapes._.isFunction(animationFrame.is) ||
                !animationFrame.is(CanvasShapes.AnimationFrame)
            ) {
                throw new CanvasShapes.Error(1045);
            }

            this.sceneInterfaceHandlers.requestRendering(
                this,
                animationFrame
            );
        }
    });

    return AnimationAbstract;
}());
