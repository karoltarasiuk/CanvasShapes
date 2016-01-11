/*global CanvasShapes*/

CanvasShapes.AnimationFrameAbstract = (function () {

    /**
     * Interface for animation helper
     */
    var AnimationFrameAbstract = function () {
        throw new CanvasShapes.Error(8024);
    };

    CanvasShapes.Class.extend(
        AnimationFrameAbstract.prototype,
        CanvasShapes.AnimationFrameInterface.prototype,
    {
        className: 'CanvasShapes.AnimationFrameAbstract',

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        next: function () {

            var currentTime = (new Date()).getTime();

            if (!this.startTime) {
                this.startTime = currentTime;
            }

            // calling stepCallback at least one more time
            this.stepCallback.call(this, currentTime - this.startTime);

            if (currentTime < this.startTime + this.totalAnimationTime) {
                // request next frame from the browser
                this.shape.sceneInterfaceHandlers.requestRendering(
                    this.shape,
                    this
                );
            } else {
                // animation finished
                if (this.callback && !this.callbackCalled) {
                    this.callback();
                    this.callbackCalled = true;
                }
            }
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        reset: function () {
            delete this.callbackCalled;
            delete this.startTime;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getType: function () {
            return this.type;
        }
    });

    return AnimationFrameAbstract;
}());
