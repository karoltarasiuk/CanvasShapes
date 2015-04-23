/*global _, CanvasShapes*/

CanvasShapes.ClassInterface = (function () {

    /**
     * Interface for any class within CanvasShapes library.
     */
    var ClassInterface = function () {
        throw new CanvasShapes.Error(8013);
    };

    _.extend(ClassInterface.prototype, {

        className: 'CanvasShapes.ClassInterface',

        /**
         * Checks whether this object is an instance of a passed class. It
         * checks `this.className` property and compares to either:
         * - passed string,
         * - to `passedClass.prototype.className` of a passed class,
         * - to `passedClass.className` property of an object.
         *
         * @param  {[string,object]} passedClass
         * @return {boolean}
         */
        is: function (passedClass) {
            throw new CanvasShapes.Error(9009);
        }
    });

    return ClassInterface;
}());
