/*global CanvasShapes*/

CanvasShapes.ShapeAbstract = (function () {

    /**
     * An abstract class for all the shapes.
     *
     * @throws {CanvasShapes.Error} 8003
     */
    var ShapeAbstract = function () {
        throw new CanvasShapes.Error(8003);
    };

    CanvasShapes.Class.extend(
        ShapeAbstract.prototype,
        CanvasShapes.ShapeInterface.prototype,
    {
        _className: 'CanvasShapes.ShapeAbstract',

        /**
         * @implements {CanvasShapes.ShapeInterface}
         *
         * @throws {CanvasShapes.Error} 1046
         */
        setParent: function (group) {
            if (
                !CanvasShapes._.isObject(group) ||
                !CanvasShapes._.isFunction(group.is) ||
                !group.is(CanvasShapes.GroupInterface)
            ) {
                throw new CanvasShapes.Error(1046);
            }

            this.parent = group;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        getParent: function () {
            return this.parent;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        getRenderingShape: function () {

            var parent = this.getParent();

            if (!parent) {
                return this;
            }

            while (parent.getParent()) {
                parent = parent.getParent();
            }

            return parent;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        isOnScene: function () {

            if (
                CanvasShapes._.isArray(this.getSceneInterfaceHandlers()) &&
                this.getSceneInterfaceHandlers().length > 0
            ) {
                return true;
            }

            return false;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         *
         * @throws {CanvasShapes.Error} 1057
         */
        setIsCollidingRatio: function (isCollidingRatio) {

            if (!CanvasShapes._.isNumber(isCollidingRatio)) {
                throw new CanvasShapes.Error(1057);
            }

            this._isCollidingRatio = isCollidingRatio;
        },

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        calculateAllowedError: function (layer) {

            var isCollidingRatio = this._isCollidingRatio ||
                    CanvasShapes.Config.get('IS_COLLIDING_RATIO'),
                allowedError = CanvasShapes._.max([
                    layer.getWidth(),
                    layer.getHeight()]
                ) * isCollidingRatio;

            if (allowedError < 1) {
                allowedError = 1;
            }

            return allowedError;
        }
    });

    return ShapeAbstract;
}());
