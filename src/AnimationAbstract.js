/*global CanvasShapes*/

CanvasShapes.AnimationAbstract = (function () {

    /**
     * Abstract implementation for any object able to animate.
     *
     * @throws {CanvasShapes.Error} 8022
     */
    var AnimationAbstract = function () {
        throw new CanvasShapes.Error(8022);
    };

    CanvasShapes.Class.extend(
        AnimationAbstract.prototype,
        CanvasShapes.AnimationInterface.prototype,
    {
        _className: 'CanvasShapes.AnimationAbstract',

        /**
         * @implements {CanvasShapes.AnimationInterface}
         *
         * @throws {CanvasShapes.Error} 1045
         */
        animate: function (animationFrame) {

            if (
                !CanvasShapes._.isObject(animationFrame) ||
                !CanvasShapes._.isFunction(animationFrame.is) ||
                !animationFrame.is(CanvasShapes.AnimationFrame)
            ) {
                throw new CanvasShapes.Error(1045);
            }

            this.getSceneInterfaceHandlers().requestRendering(
                this,
                animationFrame
            );
        }
    });

    return AnimationAbstract;
}());
