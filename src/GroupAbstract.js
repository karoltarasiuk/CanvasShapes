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
         * Must be initialized for each instance, i.e. within constructor.
         * @type {array}
         */
        shapes: null,

        /**
         * Initialization function. Must be called when creating each instance.
         * It initializes `this.shapes` array needed in any other method. This
         * method should be called every time on group initialization.
         */
        initialize: function () {
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

            var i = 0;

            if (!_.isArray(shapes)) {
                shapes = [shapes];
            }

            for (i = 0; i < shapes.length; i++) {
                if (
                    shapes[i].is &&
                    shapes[i].is(CanvasShapes.ShapeInterface)
                ) {
                    this.shapes.push(shapes[i]);
                } else {
                    throw new CanvasShapes.Error(1010);
                }
            }
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        eachShape: function (iteratee, args, deep) {

            var i,
                ret = [];

            // going through each shape
            for (i = 0; i < this.shapes.length; i++) {

                ret.push(iteratee.apply(this.shapes[i], args));

                // checking for deep iteration, and whether shape is a group
                if (
                    deep === true &&
                    this.shapes[i].is(CanvasShapes.GroupInterface)
                ) {
                    ret.push(this.shapes[i].eachShape(iteratee, args, deep));
                }
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        removeShapes: function (filter, args, deep) {

            var i,
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

                    // checking for deep iteration, and whether shape is a group
                    if (
                        deep === true &&
                        this.shapes[i].is(CanvasShapes.GroupInterface)
                    ) {
                        ret += this.shapes[i].removeShapes(filter, args, deep);
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
