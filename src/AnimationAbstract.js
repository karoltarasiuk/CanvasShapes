/*global _, CanvasShapes*/

CanvasShapes.AnimationAbstract = (function () {

    /**
     * Abstract implementation for any object able to animate.
     */
    var AnimationAbstract = function () {
        throw new CanvasShapes.Error(8022);
    };

    CanvasShapes.Class.extend(AnimationAbstract.prototype, CanvasShapes.AnimationInterface.prototype, {

        className: 'CanvasShapes.AnimationAbstract',

        /**
         * @implements {CanvasShapes.AnimationInterface}
         */
        getAnimationFrame: function (callback) {
            window.requestAnimationFrame(function () {
                callback((new Date()).getTime());
            });
        },

        /**
         * @implements {CanvasShapes.AnimationInterface}
         */
        animate: function (totalAnimationTime, stepCallback, callback, context) {

            var that = this,
                startTime = (new Date()).getTime(),
                currentTime = startTime,
                processAnimationFrame = function (time) {
                    currentTime = time;
                    if (currentTime < startTime + totalAnimationTime) {
                        // animation in progress
                        stepCallback(currentTime - startTime);
                        // request next frame from the browser
                        that.getAnimationFrame(processAnimationFrame);
                    } else {
                        // calling stepCallback for the last time
                        stepCallback(currentTime - startTime);
                        // animation finished
                        if (callback) {
                            if (context) {
                                callback = _.bind(callback, context);
                            }
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
                stepCallback = _.bind(stepCallback, context);
            }

            that.getAnimationFrame(processAnimationFrame);
        }
    });

    return AnimationAbstract;
}());
