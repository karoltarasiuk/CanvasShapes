/*global _, CanvasShapes*/

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
        animate: function (
            totalAnimationTime,
            stepCallback,
            callback,
            context
        ) {
            var that = this,
                startTime = (new Date()).getTime(),
                currentTime = startTime,
                processAnimationFrame = function () {
                    currentTime = (new Date()).getTime();
                    if (currentTime < startTime + totalAnimationTime) {
                        // animation in progress
                        stepCallback(currentTime - startTime);
                        // request next frame from the browser
                        that.sceneInterfaceHandlers.requestRendering(
                            that,
                            processAnimationFrame
                        );
                    } else {
                        // calling stepCallback for the last time
                        stepCallback(currentTime - startTime);
                        // animation finished
                        if (callback) {
                            callback();
                        }
                    }
                };

            if (
                !_.isNumber(totalAnimationTime) ||
                !_.isFunction(stepCallback) ||
                (callback && !_.isFunction(callback)) ||
                (context && !_.isObject(context))
            ) {
                throw new CanvasShapes.Error(1043);
            }

            if (context) {
                callback = _.bind(callback, context);
                stepCallback = _.bind(stepCallback, context);
            }

            this.sceneInterfaceHandlers.requestRendering(
                this,
                processAnimationFrame
            );
        }
    });

    return AnimationAbstract;
}());
