/*global _, CanvasShapes*/

CanvasShapes.GroupAbstract = (function () {

    /**
     * An abstract for objects which should serve as shape groups, i.e. shapes
     * which conists of other shapes.
     */
    var GroupAbstract = function () {
        throw new CanvasShapes.Error(8006);
    };

    CanvasShapes.Class.extend(
        GroupAbstract.prototype,
        CanvasShapes.GroupInterface.prototype,
    {
        className: 'CanvasShapes.GroupAbstract',

        /**
         * Array with all existing shapes in the group.
         * Must be initialised for each instance, i.e. within constructor.
         * @type {array}
         */
        shapes: null,

        /**
         * Initialisation function. Must be called when creating each instance.
         * It initialises `this.shapes` array needed in any other method. This
         * method should be called every time on group initialisation.
         */
        initialise: function () {
            this.shapes = [];
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        getShapes: function (filter, args) {

            var i,
                ret = [];

            if (!filter) {
                return this.shapes;
            }

            for (i = 0; i < this.shapes.length; i++) {
                if (filter.apply(this.shapes[i], args)) {
                    ret.push(this.shapes[i]);
                }
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        addShapes: function (shapes) {

            var shape,
                i = 0;

            if (!_.isArray(shapes)) {
                shapes = [shapes];
            }

            for (i = 0; i < shapes.length; i++) {

                if (_.isString(shapes[i])) {
                    shape = CanvasShapes.Class.getObject(shapes[i]);
                } else {
                    shape = shapes[i];
                }

                if (
                    _.isObject(shape) && _.isFunction(shape.is) &&
                    shape.is(CanvasShapes.ShapeInterface)
                ) {
                    this.shapes.push(shape.getUUID());
                    shape.setParent(this.getUUID());
                } else {
                    throw new CanvasShapes.Error(1010);
                }
            }

            console.log(this.shapes);
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        eachShape: function (iteratee, args, deep) {

            var i, group, shape,
                ret = [];

            // going through each shape
            for (i = 0; i < this.shapes.length; i++) {

                shape = CanvasShapes.Class.getObject(this.shapes[i]);
                ret.push(iteratee.apply(shape, args));

                // checking for deep iteration, and whether shape is a group
                if (
                    deep === true &&
                    _.isObject(shape) &&_.isFunction(shape.is) &&
                    shape.is(CanvasShapes.GroupInterface)
                ) {
                    ret.push(shape.eachShape(iteratee, args, deep));
                }
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        removeShapes: function (filter, args, deep) {

            var i, group,
                ret = 0;

            if (filter) {
                // going through each shape
                for (i = 0; i < this.shapes.length; i++) {

                    if (filter.apply(this.shapes[i], args)) {
                        // removing element modifing array in place, so loop
                        // iterator should be decremented as well
                        this.shapes.splice(i--, 1);
                        ret++;
                    }

                    group = CanvasShapes.Class.getObject(this.shapes[i]);

                    // checking for deep iteration, and whether shape is a group
                    if (
                        deep === true &&
                        _.isObject(group) && _.isFunction(group.is) &&
                        group.is(CanvasShapes.GroupInterface)
                    ) {
                        ret += group.removeShapes(filter, args, deep);
                    }
                }
            } else {
                ret = this.shapes.length;
                this.shapes = [];
            }

            return ret;
        }
    });

    return GroupAbstract;
}());
