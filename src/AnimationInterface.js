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
        animate: function (
            totalAnimationTime,
            stepCallback,
            callback,
            context
        ) {
            throw new CanvasShapes.Error(9047);
        },

        /**
         * Performs move animation.
         *
         * `totalAnimationTime` allows to define the time after which animation
         * should be finished no matter what (to prevent performance issues).
         * It's an integer containing number of miliseconds. It's passed to
         * `animate` method. If `coordinates` is an array, it will be the final
         * position of the shape. This method guarantees stopping at this
         * coordinates before calling a `callback`.
         *
         * `coordinates` can also be passed as a function of a following
         * definition:
         *
         * ```
         * function (startingCoordinates, totalTime, currentTime) {
         *     //
         *     return newCoordinates;
         * }
         * ```
         * `startingCoordinates` is basically a deepCopy of the original
         * coordinates. The function must return coordinates or coordinates
         * won't change. It is also up to this function to guarantee final
         * position of a shape. In a last exectuion `currentTime` can be bigger
         * than `totalTime` and this function should still behave correctly.
         *
         * [WARNING] This function won't perform any type or value checking for
         * performance reasons.
         *
         * @param {integer}        totalAnimationTime
         * @param {array,function} coordinates
         * @param {function}       callback [OPTIONAL]
         * @param {object}         context [OPTIONAL]
         */
        move: function (totalAnimationTime, coordinates, callback, context) {
            throw new CanvasShapes.Error(9047);
        }
    });

    return AnimationInterface;
}());
