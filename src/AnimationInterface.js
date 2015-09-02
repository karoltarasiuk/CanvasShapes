/*global _, CanvasShapes*/

CanvasShapes.AnimationInterface = (function () {

    /**
     * Interface for any object able to animate.
     */
    var AnimationInterface = function () {
        throw new CanvasShapes.Error(8021);
    };

    CanvasShapes.Class.extend(AnimationInterface.prototype, {

        className: 'CanvasShapes.AnimationInterface',

        /**
         * Method re-uses window.requestAnimationFrame method and guarantees,
         * that the callback when triggered, will receive current timestamp in
         * the same format, not relying on browser implementation.
         *
         * [WARNING] The method doesn't check for validity of the `callback`,
         * for the performance reasons. It always assume instead that the
         * argument is a function.
         *
         * @param {function} callback
         */
        getAnimationFrame: function (callback) {
            throw new CanvasShapes.Error(9046);
        },

        /**
         * Performs the animation on a shape.
         *
         * `totalAnimationTime` allows to define the time after which animation
         * should be finished no matter what (to prevent performance issues).
         * It's an integer containing number of miliseconds. After the time
         * passes, `animate` will call `stepCallback` one last time, and shape
         * needs to finish the animation. After that `callback` will be called.
         *
         * @param {integer}  totalAnimationTime
         * @param {function} stepCallback
         * @param {function} callback [OPTIONAL]
         * @param {object}   context [OPTIONAL]
         */
        animate: function (totalAnimationTime, stepCallback, callback, context) {
            throw new CanvasShapes.Error(9047);
        },

        /**
         * Performs move animation.
         *
         * `totalAnimationTime` allows to define the time after which animation
         * should be finished no matter what (to prevent performance issues).
         * It's an integer containing number of miliseconds. It's passed to
         * `animate` method. `coordinates` is the final position of the shape.
         * This method guarantees stopping at this coordinates before calling a
         * `callback`.
         *
         * @param {integer}  totalAnimationTime
         * @param {array}    coordinates
         * @param {function} callback [OPTIONAL]
         * @param {object}   context [OPTIONAL]
         */
        move: function (totalAnimationTime, coordinates, callback, context) {
            throw new CanvasShapes.Error(9047);
        }
    });

    return AnimationInterface;
}());
