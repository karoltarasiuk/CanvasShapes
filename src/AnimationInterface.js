/*global CanvasShapes*/

CanvasShapes.AnimationInterface = (function () {

    /**
     * Interface for any object able to animate.
     *
     * @throws {CanvasShapes.Error} 8021
     */
    var AnimationInterface = function () {
        throw new CanvasShapes.Error(8021);
    };

    CanvasShapes.Class.extend(AnimationInterface.prototype, {

        _className: 'CanvasShapes.AnimationInterface',

        /**
         * Performs the animation on a shape using an animation frame object,
         * which encapsulates all the needed properties and arguments.
         *
         * @throws {CanvasShapes.Error} 9047
         *
         * @param {CanvasShapes.AnimationFrame}  animationFrame
         */
        animate: function (animationFrame) {
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
         * coordinates before calling a `callback`. If `totalAnimationTime` is
         * set to 0, there is only one frame executed, like there instant
         * action.
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
         * coordinates. The function must return valid coordinates to apply. It
         * is also up to this function to guarantee final
         * position of a shape. In a last exectuion `currentTime` can be bigger
         * than `totalTime` and this function should still behave correctly.
         *
         * Another option is to pass `coordinates` as an object, which will be
         * treated as an offset added to each coordinate. It's format is:
         * ```
         * {
         *     x: {float},
         *     y: {float},
         *     z: {float} [OPTIONAL]
         * }
         * ```
         * If you decide to omit some coordinates it will be treated as `0`.
         *
         * After everything finishes, `callback` will be called. If you want to
         * run `callback` against some object, you need to bind it by yourself.
         *
         * [WARNING] This function won't perform any type or value checking for
         * performance reasons.
         *
         * [WARNING] If shape has relative renering set to `true` coordinates
         * and offset are expected to be passed as percentages of layer's
         * dimensions.
         *
         * @throws {CanvasShapes.Error} 9046
         *
         * @param {integer}                 totalAnimationTime
         * @param {[array,function,object]} coordinates
         * @param {function}                callback [OPTIONAL]
         */
        move: function (totalAnimationTime, coordinates, callback) {
            throw new CanvasShapes.Error(9046);
        }
    });

    return AnimationInterface;
}());
