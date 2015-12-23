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

            if (CanvasShapes.Class.isUUID(group)) {
                this.parent = group;
            } else {
                if (
                    !_.isObject(group) || !_.isFunction(group.is) ||
                    !group.is(CanvasShapes.GroupInterface)
                ) {
                    throw new CanvasShapes.Error(1046);
                } else {
                    group = group.getUUID();
                }
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

            var parent = this.getParent(),
                group = CanvasShapes.Class.getObject(parent);

            if (!parent) {
                return this.getUUID();
            }

            while (group.getParent()) {
                parent = group.getParent();
                group = CanvasShapes.Class.getObject(parent);
            }

            return parent;
        }
    });

    return ShapeAbstract;
}());
