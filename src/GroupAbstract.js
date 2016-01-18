/*global CanvasShapes*/

CanvasShapes.GroupAbstract = (function () {

    /**
     * An abstract for objects which should serve as shape groups, i.e. shapes
     * which conists of other shapes.
     *
     * @throws {CanvasShapes.Error} 8006
     */
    var GroupAbstract = function () {
        throw new CanvasShapes.Error(8006);
    };

    CanvasShapes.Class.extend(
        GroupAbstract.prototype,
        CanvasShapes.GroupInterface.prototype,
    {
        _className: 'CanvasShapes.GroupAbstract',

        /**
         * Initialisation function. Must be called when creating each instance.
         * It initialises `this.shapes` array needed in any other method. This
         * method should be called every time on group initialisation.
         */
        _initialise: function () {
            this._shapes = [];
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         */
        getShapes: function (filter, args) {

            var i,
                ret = [];

            if (!filter) {
                return this._shapes.slice();
            }

            for (i = 0; i < this._shapes.length; i++) {
                if (filter.apply(this._shapes[i], args)) {
                    ret.push(this._shapes[i]);
                }
            }

            return ret;
        },

        /**
         * @implements {CanvasShapes.GroupInterface}
         *
         * @throws {CanvasShapes.Error} 1010
         */
        addShapes: function (shapes) {

            var i = 0;

            if (!CanvasShapes._.isArray(shapes)) {
                shapes = [shapes];
            }

            for (i = 0; i < shapes.length; i++) {
                if (
                    shapes[i].is &&
                    shapes[i].is(CanvasShapes.ShapeInterface)
                ) {
                    this._shapes.push(shapes[i]);
                    shapes[i].setParent(this);
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
            for (i = 0; i < this._shapes.length; i++) {

                ret.push(iteratee.apply(this._shapes[i], args));

                // checking for deep iteration, and whether shape is a group
                if (
                    deep === true &&
                    this._shapes[i].is(CanvasShapes.GroupInterface)
                ) {
                    ret.push(this._shapes[i].eachShape(iteratee, args, deep));
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
                for (i = 0; i < this._shapes.length; i++) {

                    if (filter.apply(this._shapes[i], args)) {
                        // removing element modifing array in place, so loop
                        // iterator should be decremented as well
                        this._shapes.splice(i--, 1);
                        ret++;
                    }

                    // checking for deep iteration, and whether shape is a group
                    if (
                        deep === true &&
                        this._shapes[i].is(CanvasShapes.GroupInterface)
                    ) {
                        ret += this._shapes[i].removeShapes(filter, args, deep);
                    }
                }
            } else {
                ret = this._shapes.length;
                this._shapes = [];
            }

            return ret;
        }
    });

    return GroupAbstract;
}());
