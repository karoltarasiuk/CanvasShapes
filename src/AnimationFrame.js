/*global _, CanvasShapes*/

CanvasShapes.AnimationFrame = (function () {

    /**
     * A wrapper for a shape, expected by `CanvasShapes.AnimationInterface` to
     * be passed from a shape.
     */
    var AnimationFrame = function (
        shape,
        totalAnimationTime,
        stepCallback,
        callback,
        variables
    ) {
        var i;

        if (
            !_.isObject(shape) || !_.isFunction(shape.is) ||
            !shape.is(CanvasShapes.RenderingInterface) ||
            !_.isNumber(totalAnimationTime) ||
            !_.isFunction(stepCallback) ||
            (callback && !_.isFunction(callback)) ||
            (variables && (!_.isObject(variables) || _.isArray(variables)))
        ) {
            throw new CanvasShapes.Error(1043);
        }

        this.shape = shape;
        this.totalAnimationTime = totalAnimationTime;
        this.callback = callback;
        this.stepCallback = stepCallback;

        for (i in variables) {
            this[i] = variables[i];
        }
    };

    CanvasShapes.Class.extend(
        AnimationFrame.prototype,
        CanvasShapes.AnimationFrameAbstract.prototype,
    {
        className: 'CanvasShapes.AnimationFrame'
    });

    return AnimationFrame;
}());
