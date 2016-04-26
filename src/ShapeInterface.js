/*global CanvasShapes*/

CanvasShapes.ShapeInterface = (function () {

    /**
     * An interface for shapes.
     *
     * @throws {CanvasShapes.Error} 8015
     */
    var ShapeInterface = function () {
        throw new CanvasShapes.Error(8015);
    };

    CanvasShapes.Class.extend(ShapeInterface.prototype, {

        _className: 'CanvasShapes.ShapeInterface',

        /**
         * If shape is being part of a group, we need to set its parent, so it
         * knows how to render itself.
         *
         * @throws {CanvasShapes.Error} 9054
         *
         * @param {CanvasShapes.GroupInterface} group
         */
        setParent: function (group) {
            throw new CanvasShapes.Error(9054);
        },

        /**
         * Allows you to get the parent of a shape. It will return 'undefined'
         * if shape doesn't have a parent.
         *
         * @throws {CanvasShapes.Error} 9055
         *
         * @return {CanvasShapes.GroupInterface}
         */
        getParent: function () {
            throw new CanvasShapes.Error(9055);
        },

        /**
         * Allows you to get the rendering shape of a shape. There are two
         * scenarios: it's a standalone shape and then `this` will be returned,
         * or the shape is a part of a group, or nested structure of groups, and
         * then it will look for the top-most shape/group associated with a
         * layer.
         *
         * @throws {CanvasShapes.Error} 9056
         *
         * @return {CanvasShapes.RenderingInterface}
         */
        getRenderingShape: function () {
            throw new CanvasShapes.Error(9056);
        },

        /**
         * Checks whether shape was added to a scene.
         *
         * @return {boolean}
         */
        isOnScene: function () {
            throw new CanvasShapes.Error(9070);
        },

        /**
         * Checks whether this particular shape is open.
         *
         * By default no shape is open, or closed, e.g. point doesn't have this
         * property. In those cases this method should return `undefined`.
         *
         * @throws {CanvasShapes.Error} 9079
         *
         * @return {[undefined,boolean]}
         */
        isShapeOpen: function () {
            throw new CanvasShapes.Error(9079);
        },

        /**
         * Checks whether this particular shape is closed.
         *
         * By default no shape is closed, e.g. point doesn't have this
         * property. In those cases this method should return `undefined`.
         *
         * @throws {CanvasShapes.Error} 9086
         *
         * @return {[undefined,boolean]}
         */
        isShapeClosed: function () {
            throw new CanvasShapes.Error(9086);
        },

        /**
         * Checks whether this particular shape is continuous. In other words,
         * it answers the question, whether you could draw it on a paper without
         * lifting the pencil up.
         *
         * @throws {CanvasShapes.Error} 9080
         *
         * @return {boolean}]
         */
        isShapeContinuous: function () {
            throw new CanvasShapes.Error(9080);
        },

        /**
         * Allows you to overwrite global IS_COLLIDING_RATIO config value.
         *
         * @throws {CanvasShapes.Error} 1057
         *
         * @param {boolean} isCollidingRatio
         */
        setIsCollidingRatio: function (isCollidingRatio) {
            throw new CanvasShapes.Error(9071);
        }
    });

    return ShapeInterface;
}());
