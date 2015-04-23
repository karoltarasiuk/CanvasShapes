/*global _, CanvasShapes*/

CanvasShapes.GroupInterface = (function () {

    /**
     * An interface for objects which should serve as shape groups, i.e. shapes
     * which conists of other shapes.
     */
    var GroupInterface = function () {
        throw new CanvasShapes.Error(8011);
    };

    CanvasShapes.Class.extend(GroupInterface.prototype, {

        className: 'CanvasShapes.GroupInterface',

        /**
         * Allows you to get all the shapes within a group.
         * You can specify a filter function and arguments for it. It will be
         * invoked on each shape. If the filter returns `true`, the shape will
         * be included in results array.
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
         * Allows to add a new shape(s) into the group. It will return true if
         * adding was successful, or false if can't add more objects.
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
         * same function on every child. It will return `true` or `false`,
         * depending on the return value from each iteration. If every iteration
         * returns `true`, `each` will return `true` as well. Otherwise `each`
         * will return `false`.
         *
         * @param {function} iteratee
         * @param {array} args
         * @param {boolean} deep
         *
         * @return {boolean}
         */
        eachShape: function (iteratee, args, deep) {
            throw new CanvasShapes.Error(9011);
        },

        /**
         * Iterates through all the shapes in the group. Invokes `filter`
         * function on each shape with given `args` (arguments). If the shape
         * is another group, you can pass `deep` parameter as true to run the
         * same function on every child. It will return the number of deleted
         * shapes.
         *
         * Notice that if the shape which is a group, is to be deleted,
         * its children will be deleted too, but number of children will not be
         * included in the returned result.
         *
         * Group shouldn't be allowing to delete a shape by index.
         *
         * @param {function} iteratee
         * @param {array} args
         * @param {boolean} deep
         *
         * @return {integer}
         */
        removeShapes: function (filter, args, deep) {
            throw new CanvasShapes.Error(9012);
        }
    });

    return GroupInterface;
}());
