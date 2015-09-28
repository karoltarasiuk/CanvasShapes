/*global _, CanvasShapes*/

CanvasShapes.ShapeAbstract = (function () {

    var ShapeAbstract = function () {
        throw new CanvasShapes.Error(8003);
    };

    CanvasShapes.Class.extend(
        ShapeAbstract.prototype,
        CanvasShapes.ShapeInterface.prototype,
    {
        className: 'CanvasShapes.ShapeAbstract',

        /**
         * @implements {CanvasShapes.ShapeInterface}
         */
        setParent: function (group) {
            if (
                !_.isObject(group) || !_.isFunction(group.is) ||
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
        }
    });

    return ShapeAbstract;
}());
