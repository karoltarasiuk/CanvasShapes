/*global CanvasShapes*/

CanvasShapes.AnimationFrame = (function () {

    /**
     * A wrapper for a shape, expected by `CanvasShapes.AnimationInterface` to
     * be passed from a shape.
     *
     * All `variables` will become attributes of `this`, which simply means you
     * can use them as `this[variableKey]`. They won't overwrite existing
     * properties though.
     *
     * `stepCallback` definition must be as follows:
     * ```
     * function (currentTime) {
     *     // some operations changing shape's state
     * }
     * ```
     * The full example can be found in `CanvasShapes.Shape.move` method.
     *
     * Both `callback` and `stepCallback` are called without changing its
     * context, and if unbound, they have access to `this` object. But it also
     * may be useful to bind them to desired context before passing here.
     *
     * @throws {CanvasShapes.Error} 1043
     *
     * @param {CanvasShapes.RenderingInterface}   shape
     * @param {integer}                           totalAnimationTime
     * @param {function}                          stepCallback
     * @param {function}                          callback [OPTIONAL]
     * @param {object}                            variables [OPTIONAL]
     * @param {string}                            type [OPTIONAL]
     * @param {function}                          beforeRender [OPTIONAL]
     */
    var AnimationFrame = function (
        shape,
        totalAnimationTime,
        stepCallback,
        callback,
        variables,
        type,
        beforeRender
    ) {
        var i;

        if (
            !CanvasShapes._.isObject(shape) ||
            !CanvasShapes._.isFunction(shape.is) ||
            !shape.is(CanvasShapes.RenderingInterface) ||
            !CanvasShapes._.isNumber(totalAnimationTime) ||
            !CanvasShapes._.isFunction(stepCallback) ||
            (callback && !CanvasShapes._.isFunction(callback)) ||
            (variables && (!CanvasShapes._.isObject(variables) ||
            CanvasShapes._.isArray(variables))) ||
            (type && !CanvasShapes._.isString(type)) ||
            (beforeRender && !CanvasShapes._.isFunction(beforeRender))
        ) {
            throw new CanvasShapes.Error(1043);
        }

        this.shape = shape;
        this.totalAnimationTime = totalAnimationTime;
        this.callback = callback;
        this.stepCallback = stepCallback;

        // setting the type of a animation frame object
        if (!type) {
            type = '';
        }

        this.type = type;
        this.variables = {};

        // setting variables carefully to not overwrite existing properties
        if (variables) {
            for (i in variables) {
                this.variables[i] = variables[i];
            }
        }

        if (beforeRender) {
            this.beforeRender = beforeRender;
        }
    };

    CanvasShapes.Class.extend(
        AnimationFrame.prototype,
        CanvasShapes.AnimationFrameAbstract.prototype,
    {
        _className: 'CanvasShapes.AnimationFrame'
    });

    return AnimationFrame;
}());
