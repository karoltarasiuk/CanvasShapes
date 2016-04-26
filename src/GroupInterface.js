/*global CanvasShapes*/

CanvasShapes.GroupInterface = (function () {

    /**
     * An interface for objects which should serve as shape groups, i.e. shapes
     * which conists of other shapes.
     *
     * @throws {CanvasShapes.Error} 8011
     */
    var GroupInterface = function () {
        throw new CanvasShapes.Error(8011);
    };

    CanvasShapes.Class.extend(GroupInterface.prototype, {

        _className: 'CanvasShapes.GroupInterface',

        /**
         * Allows you to get all the shapes within a group.
         * You can specify a filter function and arguments for it. It will be
         * invoked on each shape. If the filter returns `true`, the shape will
         * be included in results array.
         *
         * @throws {CanvasShapes.Error} 9015
         *
         * @param {function} filter
         * @param {array} args
         *
         * @return {array} [description]
         */
        getShapes: function (filter, args) {
            throw new CanvasShapes.Error(9015);
        },

        /**
         * Gets number of shapes added to a group.
         *
         * @return {integer}
         */
        getShapesNumber: function () {
            throw new CanvasShapes.Error(9088);
        },

        /**
         * Allows to add a new shape(s) into the group. It will return true if
         * adding was successful, or false if can't add more objects.
         *
         * @throws {CanvasShapes.Error} 9010
         *
         * @param {[array,CanvasShape.ShapeInterface]} shapes [description]
         * @return {boolean}
         */
        addShapes: function (shapes) {
            throw new CanvasShapes.Error(9010);
        },

        /**
         * Iterates through all the shapes in the group. Invokes `iteratee`
         * function on each shape with given `args` (arguments). If the shape
         * is another group, you can pass `deep` parameter as true to run the
         * same function on every child. It will return an array of returned
         * values from each iteration. It will also return nested array of
         * returned values for each subgroup.
         *
         * @throws {CanvasShapes.Error} 9011
         *
         * @param {function} iteratee
         * @param {array} args
         * @param {boolean} deep
         *
         * @return {array}
         */
        eachShape: function (iteratee, args, deep) {
            throw new CanvasShapes.Error(9011);
        },

        /**
         * Iterates through all the shapes in the group. If no arguments are
         * passed it will remove all shapes.
         *
         * If `filter` function is passed, it invokes this
         * function on each shape with given `args` (arguments). If the shape
         * is another group, you can pass `deep` parameter as true to run the
         * same function on every child. It will return the number of deleted
         * shapes.
         *
         * Notice that if the shape which is a group, is to be deleted,
         * its children will be deleted too, and number of children will be
         * included in the returned value.
         *
         * Group shouldn't be allowing to delete a shape by index.
         *
         * @throws {CanvasShapes.Error} 9012
         *
         * @param {function} filter [OPTIONAL]
         * @param {array} args [OPTIONAL]
         * @param {boolean} deep [OPTIONAL]
         *
         * @return {integer}
         */
        removeShapes: function (filter, args, deep) {
            throw new CanvasShapes.Error(9012);
        }
    });

    return GroupInterface;
}());
