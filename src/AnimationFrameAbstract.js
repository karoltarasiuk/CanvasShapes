/*global CanvasShapes*/

CanvasShapes.AnimationFrameAbstract = (function () {

    /**
     * Interface for animation helper.
     *
     * @throws {CanvasShapes.Error} 8024
     */
    var AnimationFrameAbstract = function () {
        throw new CanvasShapes.Error(8024);
    };

    CanvasShapes.Class.extend(
        AnimationFrameAbstract.prototype,
        CanvasShapes.AnimationFrameInterface.prototype,
    {
        _className: 'CanvasShapes.AnimationFrameAbstract',

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
                this.shape._sceneInterfaceHandlers.requestRendering(
                    this.shape,
                    this,
                    this.beforeRender
                );
            } else {
                // request rendering for the last time and pass a callback
                this.shape._sceneInterfaceHandlers.requestRendering(
                    this.shape,
                    CanvasShapes._.bind(function () {
                        // animation finished
                        if (this.callback && !this.callbackCalled) {
                            this.callback();
                            this.callbackCalled = true;
                        }
                    }, this),
                    this.beforeRender
                );
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
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        setBeforeRender: function (beforeRender) {

            if (
                beforeRender !== undefined &&
                !CanvasShapes._.isFunction(beforeRender)
            ) {
                throw new CanvasShapes.Error(1074);
            }

            this.beforeRender = beforeRender;
        },

        /**
         * @implements {CanvasShapes.SceneInterface}
         */
        getBeforeRender: function () {
            return this.beforeRender;
        }
    });

    return AnimationFrameAbstract;
}());
